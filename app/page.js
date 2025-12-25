import { createClient } from "@/libs/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch your specific profile for the hero section
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, handle")
    .eq("handle", "mike") // Adjust to your handle
    .single();

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 selection:bg-primary/20">
      
      {/* 1. NAV BAR: Minimalist sticky */}
      <nav className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-sm font-black uppercase tracking-tighter italic">RoleDeck.io</div>
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Dashboard</Link>
            <Link href="/login" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION: "Mauve Instrument" style identity */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-fade-in">
            Now Live: Personal Analytics
          </div>
          
          <div className="flex flex-col items-center gap-6">
            {profile?.avatar_url && (
              <img 
                src={profile.avatar_url} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-black shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                alt="Identity"
              />
            )}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
              {profile?.full_name || "Mike Heath"}
            </h1>
            <p className="max-w-xl text-lg opacity-60 font-medium leading-relaxed">
              Targeted resume delivery and link tracking for the modern designer. 
              Built to make every application feel personal and professional.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-widest shadow-xl hover:-translate-y-1 transition-all">
              Create New Link
            </Link>
            <button className="px-8 py-4 border border-black/10 dark:border-white/10 font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID: Simple cards */}
      <section className="py-24 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-primary font-black text-xl italic">01</div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Tailored Links</h3>
            <p className="text-xs leading-relaxed opacity-50">Generate unique URLs for every job application to track specific engagement levels.</p>
          </div>
          <div className="space-y-4">
            <div className="text-primary font-black text-xl italic">02</div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Real-time Signals</h3>
            <p className="text-xs leading-relaxed opacity-50">Get notified the second a recruiter opens your link with precise location data.</p>
          </div>
          <div className="space-y-4">
            <div className="text-primary font-black text-xl italic">03</div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Public Profile</h3>
            <p className="text-xs leading-relaxed opacity-50">One unified source of truth for your professional identity at your personal domain.</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER: Minimalist branding */}
      <footer className="py-20 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-sm font-black uppercase tracking-tighter italic">RoleDeck.io</div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-20">© 2025 All rights reserved.</p>
          </div>
          <div className="flex gap-10">
            {['Twitter', 'LinkedIn', 'Github'].map(s => (
              <a key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}