"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse-fork");

export async function createDeck(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "Unauthorized" };

  const file = formData.get("resume_file");
  const coverLetterText = formData.get("cover_letter");
  
  let resumePath = null;
  let extractedText = "";

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    resumePath = `${user.id}/${Date.now()}.${fileExt}`;

    // 1. Storage Upload
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(resumePath, file);

    if (uploadError) return { error: true, message: "Upload failed" };

    // 2. Text Extraction
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Option object prevents the library from looking for browser-only CMaps
      const data = await pdf(buffer);
      extractedText = data.text; 
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
    }
  }

  // 3. Database Insert
  const { error } = await supabase.from("decks").insert([{
    user_id: user.id,
    company: formData.get("company"),
    slug: formData.get("slug"),
    cover_letter: { content: coverLetterText }, 
    resume_url: resumePath,
    resume_body: extractedText,
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