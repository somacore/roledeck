"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/libs/supabase/client";
import { updateProfile } from "@/app/actions";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ full_name: "", handle: "" });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, handle")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  async function handleSubmit(formData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.message);
      } else {
        toast.success("Profile updated successfully");
      }
    });
  }

  if (loading) return (
    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
      Accessing_Identity...
    </div>
  );

  return (
    <div className="max-w-2xl space-y-12">
      <header className="space-y-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a855f7]">
          RoleDeck Profile
        </h2>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
          
        </h1>
      </header>

      <form action={handleSubmit} className="bg-slate-50 dark:bg-white/[0.02] p-10 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">
              Display Name
            </label>
            <input 
              name="full_name" 
              defaultValue={profile.full_name}
              placeholder="e.g. Mike Heath"
              className="w-full bg-white dark:bg-black/20 border-none px-4 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#a855f7] outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">
              Personal Handle
            </label>
            <div className="relative flex items-center">
              <input 
                name="handle" 
                disabled
                defaultValue={profile.handle}
                className="w-full bg-white dark:bg-black/20 border-none px-4 py-4 text-sm font-bold text-slate-900 dark:text-white opacity-50 cursor-not-allowed outline-none transition-all" 
              />
              <span className="absolute right-4 text-[10px] font-black uppercase tracking-widest opacity-20 pointer-events-none">
                .roledeck.io
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tight opacity-30 mt-2 leading-relaxed">
              Your handle is permanent and defines your primary URL and public profile.
            </p>
          </div>
        </div>

        <button 
          disabled={isPending}
          className="w-full bg-slate-950 dark:bg-white text-white dark:text-black py-5 font-black uppercase text-xs tracking-[0.2em] hover:bg-[#a855f7] hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Synchronizing..." : "Save Identity Changes"}
        </button>
      </form>

      <section className="p-10 bg-slate-50/50 dark:bg-white/[0.01] rounded-xl">
        <h3 className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4">
          Current Endpoint
        </h3>
        <a 
          href={`http://${profile.handle}.lvh.me:3000`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-black uppercase tracking-widest text-[#a855f7] underline underline-offset-8 decoration-[#a855f7]/30 hover:decoration-[#a855f7] transition-all"
        >
          {profile.handle ? `${profile.handle}.roledeck.io` : "No handle set"}
        </a>
      </section>
    </div>
  );
}