"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse-fork");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * RESTORED: Sends the tailored portal link to a specified recipient via email.
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

/**
 * Creates a new tracking deck and structures it with AI.
 */
export async function createDeck(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "Unauthorized" };

  const isPublic = formData.get("is_public") === "on";
  
  // Ensure only one Primary Profile exists at a time
  if (isPublic) {
    await supabase.from("decks").update({ is_public: false }).eq("user_id", user.id);
  }

  const file = formData.get("resume_file");
  let resumePath = null;
  let extractedText = "";

  if (file && file.size > 0) {
    resumePath = `${user.id}/${Date.now()}.pdf`;
    await supabase.storage.from('resumes').upload(resumePath, file);
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = await pdf(buffer);
      extractedText = data.text; 
    } catch (e) { console.error("PDF Parse Fail", e); }
  }

  let structuredResume = null;
  if (extractedText) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { responseMimeType: "application/json" } 
      });
      const prompt = `Structure this resume text into JSON: ${extractedText}. Return ONLY: { "full_name": "", "skills": [], "experience": [{ "company": "", "role": "", "dates": "", "bullets": [] }] }`;
      const result = await model.generateContent(prompt);
      structuredResume = JSON.parse(result.response.text());
    } catch (e) { console.error("AI Structuring Fail", e); }
  }

  const { error } = await supabase.from("decks").insert([{
    user_id: user.id,
    company: isPublic ? "Primary Profile" : formData.get("company"),
    slug: isPublic ? "root" : formData.get("slug"),
    cover_letter: { content: formData.get("cover_letter") }, 
    resume_url: resumePath,
    resume_body: extractedText,
    formatted_resume: structuredResume,
    is_public: isPublic,
    tracking_email: formData.get("email_alias") || user.email
  }]);

  if (error) return { error: true, message: error.message };
  revalidatePath("/dashboard");
}

/**
 * Updates user profile (excludes permanent handle).
 */
export async function updateProfile(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "Unauthorized" };

  const { error } = await supabase.from("profiles").update({
    full_name: formData.get("full_name"),
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);

  if (error) return { error: true, message: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Duplicates a deck (Ensures is_public is false for the copy).
 */
export async function duplicateDeck(originalId, modifiedData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "Unauthorized" };

  const { data: original } = await supabase.from("decks").select("*").eq("id", originalId).single();

  const { error } = await supabase.from("decks").insert([{
    user_id: user.id,
    company: modifiedData.company,
    slug: modifiedData.slug,
    cover_letter: { content: modifiedData.cover_letter }, 
    resume_url: original.resume_url,
    resume_body: original.resume_body,
    formatted_resume: original.formatted_resume,
    is_public: false
  }]);

  if (error) return { error: true, message: error.message };
  revalidatePath("/dashboard");
  return { success: true };
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