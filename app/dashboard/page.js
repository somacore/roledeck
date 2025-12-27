"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import { deleteDeck } from "@/app/actions";
import CreateDeckModal from "@/components/CreateDeckModal";
import DuplicateDeckButton from "@/components/DuplicateDeckButton";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [decks, setDecks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchDecks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("handle")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      setDecks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleArchive = async (id) => {
    await deleteDeck(id);
    toast.success("Deck archived");
    fetchDecks();
  };

  if (loading) return (
    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
      Initializing_Workspace...
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a855f7]">
            Active Deployments
          </h2>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
            Decks
          </h1>
        </div>
        <CreateDeckModal onComplete={fetchDecks} />
      </header>

      <div className="space-y-4">
        {decks.length === 0 ? (
          <div className="bg-slate-50 dark:bg-white/[0.02] p-20 text-center rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
              No active trackers found.
            </p>
          </div>
        ) : (
          decks.map((deck) => (
            <div 
              key={deck.id} 
              className="group bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] p-8 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                    {deck.is_public ? "Main Deck" : deck.company}
                  </h3>
                  {deck.is_public && (
                    <span className="px-2 py-0.5 bg-[#a855f7]/10 text-[#a855f7] text-[8px] font-black uppercase tracking-widest rounded">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                  {deck.is_public ? "Root Subdomain" : `Slug: ${deck.slug}`}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <a 
                  href={
                    deck.is_public 
                      ? `http://${profile?.handle}.lvh.me:3000` 
                      : `http://${profile?.handle}.lvh.me:3000/t/${deck.company.replace(/\s+/g, '-')}/${deck.slug.replace(/\s+/g, '-')}`
                  } 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white underline decoration-[#a855f7]/40 underline-offset-8 hover:decoration-[#a855f7] transition-all"
                >
                  View Link
                </a>
                
                <DuplicateDeckButton deck={deck} onComplete={fetchDecks} />

                <button 
                  onClick={() => handleArchive(deck.id)} 
                  className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Archive
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}