"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Import Google AI
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResumeEmail(recipientEmail, portalUrl, companyName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'RoleDeck Portals <portals@roledeck.io>', // Update this!
      to: [recipientEmail],
      subject: `Tailored Portal for ${companyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 40px; border: 20px solid #f3f4f6;">
          <h1 style="text-transform: uppercase; letter-spacing: -0.05em; font-size: 32px;">Tailored Portal Ready</h1>
          <p style="font-size: 16px; color: #4b5563;">You have been invited to view a tailored resume and portfolio portal for <strong>${companyName}</strong>.</p>
          <a href="${portalUrl}" style="display: inline-block; background: black; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; margin-top: 20px;">
            View Full Portal
          </a>
          <p style="font-size: 10px; color: #9ca3af; margin-top: 40px;">Sent via Verified RoleDeck Portal © ${new Date().getFullYear()}</p>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Email failed:", err);
    return { success: false };
  }
}

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse-fork");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function createDeck(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "Unauthorized" };

  const file = formData.get("resume_file");
  const coverLetterText = formData.get("cover_letter");
  
  let resumePath = null;
  let extractedText = "";

  // 1. PDF Extraction
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    resumePath = `${user.id}/${Date.now()}.${fileExt}`;

    await supabase.storage.from('resumes').upload(resumePath, file);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdf(buffer);
      extractedText = data.text; 
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
    }
  }

  // 2. Gemini Structuring: Convert raw text into clean JSON
  let structuredResume = null;
  if (extractedText) {
    try {
      // Use Gemini 1.5 Flash for speed and accuracy
      const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  generationConfig: { 
    responseMimeType: "application/json" // ✅ Forces Gemini to return only valid JSON
  }
});

const prompt = `
  You are an expert resume parser. I am providing raw text extracted from a PDF that has lost its word spacing (e.g., "MarketingManager" instead of "Marketing Manager").
  
  TASK:
  1. Carefully re-insert spaces between words to make the text natural and readable.
  2. Structure this corrected text into a professional JSON object.
  
  Raw text: ${extractedText}

  Return ONLY this JSON structure:
  {
    "full_name": "string",
    "skills": ["string"],
    "experience": [
      {
        "company": "string",
        "role": "string",
        "dates": "string",
        "bullets": ["string"]
      }
    ]
  }
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      structuredResume = JSON.parse(responseText);
    } catch (error) {
      console.error("Gemini Parsing failed:", error);
      structuredResume = extractedText; // Fallback to raw text
    }
  }

  // 3. Database Insert
  const { error } = await supabase.from("decks").insert([{
    user_id: user.id,
    company: formData.get("company"),
    slug: formData.get("slug"),
    cover_letter: { content: coverLetterText }, 
    resume_url: resumePath,
    resume_body: structuredResume,
    is_public: formData.get("is_public") === "on",
    tracking_email: formData.get("email_alias") || user.email
  }]);

  if (error) return { error: true, message: error.message };

  revalidatePath("/dashboard");
}

export async function deleteDeck(id) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("decks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}