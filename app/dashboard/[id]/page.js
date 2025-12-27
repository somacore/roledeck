import { createClient } from "@/libs/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDeck, updateDeckTemplate } from "@/app/actions";

export default async function DeckViewPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch current deck and all design templates
  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .single();

  if (!deck) return notFound();

  const { data: templates } = await supabase
    .from("templates")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen p-8 text-left bg-white dark:bg-[#050505] animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* NAV & ACTIONS */}
        <div className="flex justify-between items-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
            </svg>
            Dashboard
          </Link>
          
          <form action={deleteDeck.bind(null, deck.id)}>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 border-2 border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Archive Deployment
            </button>
          </form>
        </div>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-slate-950 dark:text-white leading-none">
              {deck.company || deck.slug}
            </h1>
            {deck.is_public && (
              <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded shadow-sm">
                Primary
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Deployed on {new Date(deck.created_at).toLocaleDateString()}
          </p>
        </header>

        {/* DESIGN IDENTITY SECTION: This is where you assign Studio designs */}
        <section className="bg-slate-50 dark:bg-white/[0.02] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Design Identity</h2>
            <div className="h-[1px] bg-slate-200 dark:bg-white/5 flex-1" />
          </div>

          <form action={async (formData) => {
            "use server";
            const templateId = formData.get("template_id");
            await updateDeckTemplate(deck.id, templateId);
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Active Studio Template</label>
              <select 
                name="template_id" 
                defaultValue={deck.template_id || ""}
                className="w-full bg-white dark:bg-black/20 border-none px-4 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all rounded-none appearance-none cursor-pointer"
              >
                <option value="">None (Standard Professional Resume)</option>
                {templates?.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit"
              className="bg-slate-950 dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm"
            >
              Apply Design Changes
            </button>
          </form>
        </section>

        {/* SOURCE PREVIEW */}
        <section className="bg-slate-50 dark:bg-white/[0.02] p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Resume Content Source</h2>
            <div className="h-[1px] bg-slate-200 dark:bg-white/5 flex-1" />
          </div>
          <div className="whitespace-pre-wrap leading-relaxed text-sm font-medium text-slate-600 dark:text-slate-400">
            {deck.resume_body || "No content found."}
          </div>
        </section>
      </div>
    </main>
  );
}