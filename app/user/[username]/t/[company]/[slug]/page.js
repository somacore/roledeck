import { createClient } from "@/libs/supabase/server";
import { notFound } from "next/navigation";

export default async function TrackerPage({ params }) {
  const resolvedParams = await params;
  

const username = decodeURIComponent(resolvedParams.username?.replace(/['"]+/g, '').trim());
const company = decodeURIComponent(resolvedParams.company).replace(/-/g, ' ');
const slug = decodeURIComponent(resolvedParams.slug).replace(/-/g, ' ');

  const supabase = await createClient();

  // 3. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .ilike("handle", username) 
    .single();

  if (!profile) return notFound();

  // 4. Fetch Deck
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, company, slug, cover_letter, resume_body, resume_url")
    .eq("user_id", profile.id)
    .ilike("company", company)
    .ilike("slug", slug) // Now matches "Facelicking Manager"
    .is("deleted_at", null)
    .single();

  if (deckError || !deck) return notFound();

  // 5. Generate Signed URL
  let secureResumeUrl = null;
  if (deck.resume_url) {
    const { data: signedData } = await supabase.storage
      .from('resumes')
      .createSignedUrl(deck.resume_url, 3600);
    secureResumeUrl = signedData?.signedUrl;
  }

  const intro = typeof deck.cover_letter === 'object' 
    ? deck.cover_letter?.content 
    : deck.cover_letter;

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans p-8 md:p-24 leading-normal">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-3xl font-bold text-black uppercase tracking-tighter">
              {profile.full_name}
            </h1>
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-2 italic">
              {company} Portal
            </p>
          </div>

          {secureResumeUrl && (
            <a 
              href={secureResumeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all border-2 border-black"
            >
              Download PDF
            </a>
          )}
        </header>

        <div className="space-y-12">
          {intro && (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">Intro</div>
              <div className="md:col-span-3 text-xl italic text-slate-700 whitespace-pre-wrap leading-relaxed border-l-4 border-slate-100 pl-8">
                {intro}
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-slate-100 pt-12">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1">Experience</div>
            <div className="md:col-span-3">
              {deck.resume_body ? (
                <div className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                  {deck.resume_body}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No resume text content extracted. Use the download button.</p>
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}