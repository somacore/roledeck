import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteDeck } from "@/app/actions";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Check Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Profile to get the handle
  const { data: profile } = await supabase
    .from("profiles")
    .select("handle")
    .eq("id", user.id)
    .single();

  // 3. Fetch Active Decks (Primary Profile + Job Trackers)
  const { data: decks } = await supabase
    .from("decks")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("is_public", { ascending: false })
    .order("created_at", { ascending: false });

  // 4. Construct Public Base URL for links
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://lvh.me:3000";
  const protocol = baseUrl.split("://")[0];
  const domain = baseUrl.split("://")[1];

  return (
    <div className="space-y-12 animate-fade-in text-left">
      <header className="flex justify-between items-end pb-8 border-b border-black/5 dark:border-white/5">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
            Deployments
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {decks?.length || 0} Active Career Portals
          </p>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/dashboard/new" 
            className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
          >
            + New Deployment
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {decks?.map((deck) => {
          const publicUrl = deck.is_public 
            ? `${protocol}://${profile.handle}.${domain}`
            : `${protocol}://${profile.handle}.${domain}/t/${deck.company.toLowerCase().replace(/\s+/g, '-')}/${deck.slug}`;

          return (
            <div 
              key={deck.id} 
              className="group bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 transition-all hover:border-primary/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {/* NAVIGATION LINK: This takes you to /dashboard/[id] */}
                  <Link 
                    href={`/dashboard/${deck.id}`} 
                    className="hover:text-primary transition-colors decoration-primary/20 hover:underline underline-offset-8"
                  >
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
                      {deck.is_public ? "Global Profile" : deck.company}
                    </h3>
                  </Link>
                  {deck.is_public && (
                    <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded shadow-sm">
                      Main
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {deck.is_public ? "Root Domain Redirect" : `Slug: ${deck.slug}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-end">
                   <a 
                    href={publicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
                  >
                    View Portal ↗
                  </a>
                </div>

                <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/5 hidden md:block"></div>

                <div className="flex items-center gap-4">
                  <CopyLinkButton url={publicUrl} />
                  
                  {/* RE-INITIALIZED LINK: Another way to access settings */}
                  <Link 
                    href={`/dashboard/${deck.id}`}
                    className="p-2 opacity-20 hover:opacity-100 transition-opacity"
                    title="Settings"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.205 1.251l-1.18 2.044a1 1 0 01-1.186.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.331 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.113a7.047 7.047 0 010-2.228l-1.267-1.113a1 1 0 01-.205-1.251l1.18-2.044a1 1 0 011.186-.447l1.598.54a6.993 6.993 0 011.929-1.115l.331-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <form action={deleteDeck.bind(null, deck.id)}>
                    <button 
                      type="submit" 
                      className="text-red-500 opacity-20 hover:opacity-100 transition-opacity p-2 cursor-pointer"
                      title="Archive Deployment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}