"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import Link from "next/link";
import toast from "react-hot-toast";

/**
 * Deck Studio Index: Manages the user's custom design templates.
 */
export default function StudioPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTemplates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("templates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setTemplates(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Logic to import a template from a JSON config file
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from("templates")
          .insert([{ 
            user_id: user.id, 
            name: importedData.name || "Imported Design", 
            config: importedData.config || importedData 
          }]);

        if (error) throw error;
        toast.success("Design imported to Studio");
        fetchTemplates();
      } catch (err) {
        toast.error("Invalid JSON configuration");
      }
    };
    reader.readAsText(file);
  };

  if (loading) return (
    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
      Accessing_Studio_Assets...
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* HEADER: Action-oriented minimalist design */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Studio Configuration
          </h2>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
            Design Templates
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-950 dark:text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm">
            Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <Link 
            href="/dashboard/studio/new"
            className="bg-slate-950 dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-md"
          >
            New Design
          </Link>
        </div>
      </header>

      {/* GRID: Template Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full bg-slate-50 dark:bg-white/[0.02] p-20 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
              No design templates found in your studio.
            </p>
          </div>
        ) : (
          templates.map((template) => (
            <div 
              key={template.id} 
              className="group bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04] p-8 transition-all flex flex-col justify-between gap-8 border border-black/5 dark:border-white/5 relative overflow-hidden"
            >
              <div className="space-y-2 relative z-10">
                <div className="w-10 h-1 mb-6 bg-primary/20 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {template.config?.sections?.length || 0} Active Sections
                </p>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-black/5 dark:border-white/5 relative z-10">
                <Link 
                  href={`/dashboard/studio/${template.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-primary underline underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all"
                >
                  Open Builder
                </Link>
                <button 
                  onClick={async () => {
                    if (confirm("Permanently remove this design template?")) {
                      const { error } = await supabase.from("templates").delete().eq("id", template.id);
                      if (!error) {
                        toast.success("Design deleted");
                        fetchTemplates();
                      }
                    }
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Delete
                </button>
              </div>
              
              {/* Subtle geometric accent */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}