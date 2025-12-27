import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import PrintButton from "@/components/PrintButton";
import StudioRenderer from "@/components/StudioRenderer";
import { getSEOTags } from "@/libs/seo";

/**
 * Generate dynamic SEO tags for the profile.
 * If a Studio design is active, it uses the template name or hero title.
 */
export async function generateMetadata({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, handle")
    .ilike("handle", username)
    .single();

  if (!profile) return {};

  const { data: deck } = await supabase
    .from("decks")
    .select("company, templates(name, config)")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .is("deleted_at", null)
    .maybeSingle();

  const title = deck?.templates?.name || `${profile.full_name} | RoleDeck`;
  const description = deck?.templates?.config?.sections?.find(s => s.type === 'hero')?.content?.subtitle || `Professional portfolio and resume for ${profile.full_name}.`;

  return getSEOTags({
    title,
    description,
    canonicalUrlRelative: `/user/${profile.handle}`,
  });
}

export default async function PublicResume({ params }) {
  const { username } = await params;
  const headerList = await headers();
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .ilike("handle", username)
    .single();

  if (!profile) return notFound();

  // 2. Fetch the primary deck and its associated template
  const { data: deck } = await supabase
    .from("decks")
    .select(`
      *,
      templates (
        id,
        config
      )
    `)
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (!deck) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Profile Offline</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">This user has not published a primary profile.</p>
        </div>
      </main>
    );
  }

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

  // 4. Server-Side Asset Signing:
  // We sign all private paths in the template config so the public viewer can see them.
  let signedConfig = deck.templates?.config;
  if (signedConfig?.sections) {
    for (let section of signedConfig.sections) {
      if (section.type === 'gallery' && section.content.images) {
        for (let img of section.content.images) {
          if (img.path) {
            const { data } = await supabaseAdmin.storage
              .from('studio-assets')
              .createSignedUrl(img.path, 3600); // 1 hour expiry
            img.signedUrl = data?.signedUrl;
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans py-20 px-6">
      <div className="max-w-4xl mx-auto p-16 bg-white shadow-sm print:p-0 print:shadow-none">
        
        {deck.templates ? (
          <StudioRenderer 
            config={signedConfig} 
            resumeData={deck.formatted_resume} 
          />
        ) : (
          <>
            <div className="flex justify-between items-start pb-10 mb-12 border-b-4 border-slate-900">
              <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                  {deck.formatted_resume?.full_name || profile.full_name}
                </h1>
                <p className="text-lg font-bold uppercase tracking-widest text-slate-400">{profile.email}</p>
              </div>
              <div className="no-print">
                <PrintButton />
              </div>
            </div>

            {deck.formatted_resume?.experience?.length > 0 && (
              <section className="space-y-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Professional History</h2>
                <div className="space-y-12">
                  {deck.formatted_resume.experience.map((job, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-black uppercase tracking-tight">{job.role}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{job.dates}</span>
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">{job.company}</p>
                      <ul className="space-y-2">
                        {job.bullets?.map((bullet, j) => (
                          <li key={j} className="text-sm font-medium leading-relaxed text-slate-600 flex gap-4">
                            <span className="shrink-0 text-primary">—</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mt-32 pt-8 border-t border-slate-100 flex justify-between opacity-20 text-[9px] font-black uppercase tracking-widest">
           <span>Verified RoleDeck Identity</span>
           <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}