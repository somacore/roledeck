"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default function DashboardLayout({ children }) {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!supabase) return;
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: prof } = await supabase
          .from("profiles")
          .select("handle")
          .eq("id", authUser.id)
          .single();
        setProfile(prof);

        const { data: d } = await supabase
          .from("decks")
          .select("id, company, slug, is_public")
          .eq("user_id", authUser.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false });
        setDecks(d || []);
      }
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#080808] text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col h-full shrink-0 bg-slate-50 dark:bg-[#0c0c0c]">
        
        {/* BRAND SECTION */}
        <div className="p-8">
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 text-left">
          <div className="px-4 space-y-1">
            <Link 
              href="/dashboard" 
              className={`block px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                pathname === "/dashboard" 
                  ? "bg-white dark:bg-white/5 shadow-sm dark:shadow-none text-primary" 
                  : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
              }`}
            >
              Decks
            </Link>
          </div>

          <div className="mt-12 px-4 text-left">
            <button 
              onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)} 
              className="w-full px-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white mb-4 cursor-pointer"
            >
              Deck Analytics <span className="text-[8px]">{isAnalyticsOpen ? "▼" : "▲"}</span>
            </button>
            {isAnalyticsOpen && (
              <div className="space-y-1">
                {decks.map((deck) => (
                  <Link 
                    key={deck.id} 
                    href={`/dashboard/analytics/${deck.id}`} 
                    className={`block px-4 py-2 text-[10px] font-bold uppercase tracking-widest truncate rounded-lg transition-all ${
                      pathname.includes(deck.id) 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
                    }`}
                  >
                    {deck.is_public ? "Main Deck" : deck.company || "Target"}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 mt-auto space-y-1">
          <Link 
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              pathname === "/dashboard/profile"
                ? "bg-white dark:bg-white/5 text-primary"
                : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
            }`}
          >
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[8px] font-black text-slate-600 dark:text-white/60">
                {(user?.user_metadata?.name || profile?.handle || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            Account
          </Link>

          <Link 
            href="/dashboard/billing"
            className={`flex items-center gap-3 w-full text-left px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              pathname === "/dashboard/billing"
                ? "bg-white dark:bg-white/5 text-primary"
                : "text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white"
            }`}
          >
            <div className="w-5 h-5 shrink-0" /> 
            Billing
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-[#080808]">
        <header className="h-20 flex items-center justify-end px-12 shrink-0 bg-white/80 dark:bg-transparent backdrop-blur-md">
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