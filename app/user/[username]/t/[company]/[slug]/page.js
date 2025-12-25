import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PrintButton from "@/components/PrintButton";
import CopyEmailButton from "@/components/CopyEmailButton";
import SendResumeButton from "@/components/SendResumeButton";

// Initialize Gemini for on-demand restructuring
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function TrackerPage({ params }) {
  const resolvedParams = await params;
  const headerList = await headers(); 
  
  const username = decodeURIComponent(resolvedParams.username?.replace(/['"]+/g, '').trim());
  const company = decodeURIComponent(resolvedParams.company).replace(/-/g, ' ');
  const slug = decodeURIComponent(resolvedParams.slug).replace(/-/g, ' ');

  const supabase = await createClient(); 
  const supabaseAdmin = createAdminClient(); 

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .ilike("handle", username) 
    .single();

  if (!profile) return notFound();

  // 2. Fetch Deck
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, company, slug, cover_letter, resume_body, resume_url, tracking_email")
    .eq("user_id", profile.id)
    .ilike("company", company)
    .ilike("slug", slug)
    .is("deleted_at", null)
    .single();

  if (deckError || !deck) return notFound();

  // 3. Telemetry
  try {
    const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = headerList.get("user-agent");
    await supabaseAdmin.from("views").insert({
      deck_id: deck.id,
      viewer_ip: ip,
      user_agent: userAgent
    });
  } catch (e) { console.error("Telemetry failed"); }

  // 4. Secure Download URL
  let secureResumeUrl = null;
  if (deck.resume_url) {
    const { data: signedData } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(deck.resume_url, 3600);
    secureResumeUrl = signedData?.signedUrl;
  }

  // 5. ON-DEMAND FORMATTING LOGIC
  let resumeData = null;
  
  // Check if it's already an object (new/fixed data) or a string (old/trash data)
  const isRawString = typeof deck.resume_body === 'string';

  if (!isRawString && deck.resume_body !== null) {
    resumeData = deck.resume_body;
  } else if (isRawString && deck.resume_body.length > 10) {
    // 🚀 SELF-HEALING: If the data is a string, fix it on-demand
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        You are a resume spacing and structure expert. 
        TASK: Fix the word spacing and structure this raw resume text into JSON. 
        Re-insert missing spaces (e.g., convert "MarketingManager" to "Marketing Manager").

        RAW TEXT: ${deck.resume_body}

        Return ONLY this JSON:
        {
          "full_name": "string",
          "skills": ["string"],
          "experience": [
            { "company": "string", "role": "string", "dates": "string", "bullets": ["string"] }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      
      // Update local variable for immediate display
      resumeData = parsed;

      // ✅ SAVE BACK TO DB: Avoid parsing this link again
      await supabaseAdmin
        .from("decks")
        .update({ resume_body: parsed })
        .eq("id", deck.id);

    } catch (e) {
      console.error("On-demand parsing failed:", e);
      resumeData = null; // Fallback to raw text rendering below
    }
  }

  const introText = deck.cover_letter?.content || String(deck.cover_letter || "");

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans py-12 px-4">
      <div className="max-w-4xl mx-auto p-12 bg-white shadow-xl rounded-sm print:shadow-none print:p-0">
        
        {/* TOP ACTION BAR */}
        
        {/* TOP ACTION BAR */}
<div className="flex flex-wrap justify-end items-center gap-3 mb-12 no-print">
  
  {/* ✅ NEW: SEND TO EMAIL MODAL */}
  <SendResumeButton 
    portalUrl={typeof window !== 'undefined' ? window.location.href : ''} 
    companyName={company} 
  />

  <CopyEmailButton email={deck.tracking_email} />
  
  {secureResumeUrl && (
    <a 
      href={secureResumeUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#7c3aed] transition-all flex items-center gap-2"
    >
      Download PDF
    </a>
  )}
  
  <PrintButton />
</div>

        {/* RESUME HEADER */}
        <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              {resumeData?.full_name || profile.full_name}
            </h1>
            <p className="text-xl font-medium text-gray-500">{profile.email}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black bg-black text-white px-2 py-1 uppercase tracking-widest leading-none">
              {company} Portal
            </span>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter mt-2">
              {deck.slug}
            </p>
          </div>
        </div>

        {/* TAILORED INTRO */}
        {introText && (
          <section className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-4">
              Tailored Introduction <div className="h-[1px] bg-gray-100 flex-1"></div>
            </h2>
            <div className="text-xl italic text-gray-700 whitespace-pre-wrap leading-relaxed border-l-4 border-gray-100 pl-8">
              {introText}
            </div>
          </section>
        )}

        {/* MAIN CONTENT */}
        <div className="space-y-12">
          {resumeData ? (
            <>
              {/* STRUCTURED SKILLS */}
              {resumeData.skills?.length > 0 && (
                <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-4 flex items-center gap-4">
                    Skills <div className="h-[1px] bg-gray-100 flex-1"></div>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* STRUCTURED EXPERIENCE */}
              {resumeData.experience?.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-4">
                    Professional Experience <div className="h-[1px] bg-gray-100 flex-1"></div>
                  </h2>
                  <div className="space-y-8">
                    {resumeData.experience.map((job, i) => (
                      <div key={i} className="mb-8">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl font-black uppercase tracking-tight">{job.role}</h3>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{job.dates}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{job.company}</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-gray-800">
                          {job.bullets?.map((bullet, j) => (
                            <li key={j}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            /* FALLBACK: If AI failed or data is missing, show raw text */
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-4">
                Experience Details <div className="h-[1px] bg-gray-100 flex-1"></div>
              </h2>
              <div className="whitespace-pre-wrap text-sm leading-[1.8] text-gray-800 font-medium">
                {deck.resume_body || "No experience data available."}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center opacity-30 text-[10px] font-bold uppercase tracking-[0.2em]">
           <span>Verified RoleDeck Portal</span>
           <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}