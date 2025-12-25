"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [decks, setDecks] = useState([]);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from("profiles").select("handle").eq("id", user.id).single();
        setProfile(prof);
        const { data: d } = await supabase.from("decks").select("id, company, slug, is_public").eq("user_id", user.id).is("deleted_at", null).order("created_at", { ascending: false });
        setDecks(d || []);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#080808] text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/10 flex flex-col h-full shrink-0 bg-slate-50/50 dark:bg-transparent">
        <div className="p-8 border-b border-slate-200 dark:border-white/10">
          <h1 className="text-lg font-black tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
            {profile?.handle || "Set Handle..."}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-8">
          <div className="px-4 space-y-1">
            <Link 
              href="/dashboard" 
              className={`block px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                pathname === "/dashboard" 
                  ? "bg-white dark:bg-white/5 shadow-sm dark:shadow-none text-[#a855f7] border border-slate-200 dark:border-transparent" 
                  : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
              }`}
            >
              Overview
            </Link>
          </div>

          <div className="mt-12 px-4">
            <button 
              onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} 
              className="w-full px-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white mb-4 cursor-pointer"
            >
              Analytics <span className="text-[8px]">{isAnalyticsOpen ? "▼" : "▲"}</span>
            </button>
            {isAnalyticsOpen && (
              <div className="space-y-1">
                {decks.map((deck) => (
                  <Link 
                    key={deck.id} 
                    href={`/dashboard/analytics/${deck.id}`} 
                    className={`block px-4 py-2 text-[10px] font-bold uppercase tracking-widest truncate rounded-lg transition-all ${
                      pathname.includes(deck.id) 
                        ? "bg-[#a855f7]/10 text-[#a855f7]" 
                        : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
                    }`}
                  >
                    {deck.is_public ? "Public Profile" : deck.company || "Target"}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* VIEWPORT */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-[#080808]">
        <header className="h-20 border-b border-slate-200 dark:border-white/10 flex items-center justify-end px-12 shrink-0 bg-white/80 dark:bg-transparent backdrop-blur-md">
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-12 max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}