"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/libs/supabase/client";
import { createDeck, deleteDeck } from "@/app/actions";
import DuplicateDeckButton from "@/components/DuplicateDeckButton";

export default function Dashboard() {
  const [profile, setProfile] = useState(null); 
  const [decks, setDecks] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState(null);
  const supabase = createClient();

  // Abstracted data fetch for re-use in live updates
  async function refreshDecks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("handle")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data: d } = await supabase
        .from("decks")
        .select(`*, views:views(count)`)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      setDecks(d?.map(deck => ({ ...deck, viewCount: deck.views?.[0]?.count || 0 })) || []);
    }
  }

  useEffect(() => {
    refreshDecks();
  }, []);

  async function handleSubmit(formData) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await createDeck(formData);
      if (result?.error) {
        setErrorMessage(result.message);
      } else {
        // LIVE UPDATE: Refresh list and reset form
        await refreshDecks();
        document.querySelector('form').reset();
        setIsPublic(false);
      }
    });
  }

  async function handleArchive(id) {
    startTransition(async () => {
      await deleteDeck(id);
      await refreshDecks();
    });
  }

  return (
    <div className="space-y-16">
      <header className="space-y-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-white/20">Workspace</h2>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
          {profile?.handle ? `${profile.handle}.ROLEDECK.IO` : "LOADING..."}
        </h1>
      </header>

      <section className="space-y-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Create New Link</h3>
        <form action={handleSubmit} className="grid gap-8 bg-slate-50 dark:bg-white/[0.02] p-10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-widest">Error: {errorMessage}</div>
          )}

          <div className="flex items-center gap-4">
            <input type="checkbox" name="is_public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="w-5 h-5 accent-[#a855f7] border-slate-300" />
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white/60">Primary Profile</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Company</label>
              <input name="company" disabled={isPublic} className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-300 focus:border-[#a855f7] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Role</label>
              <input name="slug" disabled={isPublic} className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-300 focus:border-[#a855f7] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Alias</label>
              <input name="email_alias" className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-300 focus:border-[#a855f7] outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Resume PDF (Optional)</label>
            <input 
              type="file" 
              name="resume_file" 
              accept=".pdf" 
              className="w-full bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 px-4 py-3 text-slate-900 dark:text-white file:bg-slate-900 dark:file:bg-white file:text-white dark:file:text-black file:border-none file:px-4 file:py-1 file:text-[10px] file:font-black file:uppercase file:mr-4 file:cursor-pointer" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Cover Letter</label>
            <textarea name="cover_letter" className="w-full min-h-[100px] bg-white dark:bg-black/20 border border-slate-300 dark:border-white/10 p-6 text-slate-900 dark:text-white placeholder:text-slate-300 focus:border-[#a855f7] outline-none transition-all" placeholder="Paste tailored cover letter content..."></textarea>
          </div>
          
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#a855f7] hover:text-white transition-all cursor-pointer">
            {isPending ? 'Processing...' : 'Deploy Link'}
          </button>
        </form>
      </section>

      <section className="space-y-8 pb-32">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Deployment Status</h3>
        <div className="border border-slate-200 dark:border-white/10 divide-y divide-slate-200 dark:divide-white/10">
          {decks.map(deck => (
            <div key={deck.id} className="p-8 bg-white dark:bg-transparent flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all">
              <div className="space-y-2 text-left">
                <span className="text-[#a855f7] font-black text-[10px] uppercase tracking-widest">{deck.viewCount} Recipient Opens</span>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">{deck.is_public ? "Public Profile" : deck.company}</h3>
                  {deck.resume_url && <span className="text-[8px] bg-green-100 text-green-700 px-2 py-0.5 font-black uppercase tracking-tighter rounded">PDF Attached</span>}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold">
                  {deck.slug || "ROOT"} {deck.email_alias ? `• ALIAS: ${deck.email_alias}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-10">
                <a href={`http://${profile?.handle}.lvh.me:3000/t/${deck.company.replace(/\s+/g, '-')}/${deck.slug.replace(/\s+/g, '-')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white underline decoration-[#a855f7]/40 underline-offset-8 hover:decoration-[#a855f7]">View Link</a>
                
                <DuplicateDeckButton deck={deck} onComplete={refreshDecks} />
                
                <button onClick={() => handleArchive(deck.id)} className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors cursor-pointer">Archive</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}