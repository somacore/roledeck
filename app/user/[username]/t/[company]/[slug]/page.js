import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PrintButton from "@/components/PrintButton";
import CopyEmailButton from "@/components/CopyEmailButton";
import SendResumeButton from "@/components/SendResumeButton";
import StudioRenderer from "@/components/StudioRenderer";
import { getSEOTags } from "@/libs/seo";

// Initialize Gemini for on-demand restructuring
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate dynamic SEO tags for the tailored portal.
 */
export async function generateMetadata({ params }) {
  const { username, company } = await params;
  const decodedCompany = decodeURIComponent(company).replace(/-/g, ' ');
  
  return getSEOTags({
    title: `Tailored Portal: ${decodedCompany} | RoleDeck`,
    description: `Private career portal for the team at ${decodedCompany}.`,
    canonicalUrlRelative: `/user/${username}/t/${company}`,
  });
}

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

  // 2. Fetch Deck (Including template data if assigned)
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select(`
      *,
      templates (
        id,
        config
      )
    `)
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

  // 4. Secure Resume Download URL
  let secureResumeUrl = null;
  if (deck.resume_url) {
    const { data: signedData } = await supabaseAdmin.storage
      .from('resumes')
      .createSignedUrl(deck.resume_url, 3600);
    secureResumeUrl = signedData?.signedUrl;
  }

  // 5. On-Demand Logic for Resume Data
  let resumeData = deck.formatted_resume;
  if (!resumeData && typeof deck.resume_body === 'string' && deck.resume_body.length > 10) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `Structure this resume text into JSON: ${deck.resume_body}. Return ONLY: { "full_name": "", "skills": [], "experience": [{ "company": "", "role": "", "dates": "", "bullets": [] }] }`;
      const result = await model.generateContent(prompt);
      resumeData = JSON.parse(result.response.text());
      await supabaseAdmin.from("decks").update({ formatted_resume: resumeData }).eq("id", deck.id);
    } catch (e) { console.error("On-demand parsing failed"); }
  }

  // 6. Server-Side Studio Asset Signing
  let signedConfig = deck.templates?.config;
  if (signedConfig?.sections) {
    for (let section of signedConfig.sections) {
      if (section.type === 'gallery' && section.content.images) {
        for (let img of section.content.images) {
          if (img.path) {
            const { data } = await supabaseAdmin.storage
              .from('studio-assets')
              .createSignedUrl(img.path, 3600);
            img.signedUrl = data?.signedUrl;
          }
        }
      }
    }
  }

  const introText = deck.cover_letter?.content || String(deck.cover_letter || "");

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans py-12 px-4">
      <div className="max-w-4xl mx-auto p-12 bg-white shadow-xl rounded-sm print:shadow-none print:p-0">
        
        {/* TOP ACTION BAR */}
        <div className="flex flex-wrap justify-end items-center gap-3 mb-12 no-print">
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
              className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
            >
              Download PDF
            </a>
          )}
          <PrintButton />
        </div>

        {deck.templates ? (
          <StudioRenderer 
            config={signedConfig} 
            resumeData={resumeData} 
          />
        ) : (
          <>
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

            {introText && (
              <section className="mb-12">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-4">
                  Tailored Introduction <div className="h-[1px] bg-gray-100 flex-1"></div>
                </h2>
                <div className="text-xl italic text-gray-700 whitespace-pre-wrap leading-relaxed border-l-4 border-gray-100 pl-8">
                  {introText}
                </div>
              </section>
            )}

            <div className="space-y-12">
              {resumeData?.experience?.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-4">
                    Professional Experience <div className="h-[1px] bg-gray-100 flex-1"></div>
                  </h2>
                  <div className="space-y-8">
                    {resumeData.experience.map((job, i) => (
                      <div key={i} className="mb-8">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-xl font-black uppercase tracking-tight">{job.role}</h3>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{job.dates}</span>
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
            </div>
          </>
        )}

        <footer className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center opacity-30 text-[10px] font-bold uppercase tracking-[0.2em]">
           <span>Verified RoleDeck Portal</span>
           <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}