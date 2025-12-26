"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends the tailored portal link to a specified recipient via email.
 */
export async function sendResumeEmail(recipientEmail, portalUrl, companyName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'RoleDeck Portals <portals@roledeck.io>',
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

// Initialize Gemini 2.5 Flash for 2025 standards
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Creates a new tracking deck, extracts PDF text, and structures it with AI.
 */
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

  // 2. Gemini Structuring: Fixes spacing and converts raw text to JSON
  let structuredResume = null;
  if (extractedText) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { 
          responseMimeType: "application/json" // ✅ Forces JSON output
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
      // Fallback is handled by keeping resume_body as the raw string
    }
  }

  // 3. Database Insert: Populates both raw and formatted columns
  const { error } = await supabase.from("decks").insert([{
    user_id: user.id,
    company: formData.get("company"),
    slug: formData.get("slug"),
    cover_letter: { content: coverLetterText }, 
    resume_url: resumePath,
    resume_body: extractedText, // Raw backup
    formatted_resume: structuredResume, // AI-structured JSON
    is_public: formData.get("is_public") === "on",
    tracking_email: formData.get("email_alias") || user.email
  }]);

  if (error) return { error: true, message: error.message };

  revalidatePath("/dashboard");
}

/**
 * Soft deletes a deck.
 */
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

// app/actions.js

// app/actions.js
export async function duplicateDeck(originalId, modifiedData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "Unauthorized" };

  // Fetch base data from the original record
  const { data: original } = await supabase
    .from("decks")
    .select("resume_body, formatted_resume, resume_url")
    .eq("id", originalId)
    .single();

  const { data: newDeck, error: insertError } = await supabase
    .from("decks")
    .insert([{
      user_id: user.id,
      company: modifiedData.company,
      slug: modifiedData.slug,
      cover_letter: { content: modifiedData.cover_letter }, 
      resume_url: original.resume_url, // Reuse the PDF
      resume_body: original.resume_body, // Reuse raw text
      formatted_resume: original.formatted_resume, // Reuse AI JSON
      tracking_email: user.email,
      is_public: true
    }])
    .select()
    .single();

  if (insertError) return { error: true, message: insertError.message };

  revalidatePath("/dashboard");
  return { success: true };
}