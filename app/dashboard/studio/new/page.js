"use client";

import { useState } from "react";
import { createTemplate } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PRESETS = [
  {
    id: "empty",
    name: "Blank Canvas",
    description: "Start from scratch and add sections manually.",
    sections: []
  },
  {
    id: "basic",
    name: "Basic Portfolio",
    description: "A clean layout with a Hero, Skills, and Resume sections.",
    sections: [
      { type: "hero", content: { title: "Professional Identity", subtitle: "Designer & Developer" } },
      { type: "resume_snapshot", content: {} },
      { type: "portfolio_links", content: { links: [] } }
    ]
  },
  {
    id: "showcase",
    name: "Full Showcase",
    description: "Maximum impact with Gallery, Testimonials, and full Resume.",
    sections: [
      { type: "hero", content: { title: "Featured Work", subtitle: "Full Project Showcase" } },
      { type: "gallery", content: { images: [] } },
      { type: "testimonials", content: { items: [] } },
      { type: "resume_snapshot", content: {} }
    ]
  }
];

/**
 * Page to initialize a new Deck Studio template.
 */
export default function NewTemplatePage() {
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("empty");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const preset = PRESETS.find(p => p.id === selectedPreset);
    
    // Add the JSON config to the form data
    formData.append("config", JSON.stringify({ sections: preset.sections }));

    try {
      const result = await createTemplate(formData);
      if (result?.error) {
        toast.error(result.message);
      } else {
        toast.success("Design initialized in Studio");
        router.push(`/dashboard/studio/${result.id}`);
      }
    } catch (err) {
      toast.error("Failed to initialize design");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <header className="space-y-2">
        <Link 
          href="/dashboard/studio" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
          </svg>
          Back to Library
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">
          Initialize New Design
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Name Input */}
        <div className="space-y-2 max-w-md">
          <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">
            Design Name
          </label>
          <input 
            name="name" 
            required 
            placeholder="e.g. Minimalist Designer V1"
            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-transparent px-4 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/20 outline-none transition-all rounded-none" 
          />
        </div>

        {/* Preset Selection */}
        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white block">
            Starting Point
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset.id)}
                className={`p-6 text-left border-2 transition-all group relative overflow-hidden ${
                  selectedPreset === preset.id 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] hover:border-black/20 dark:hover:border-white/20"
                }`}
              >
                <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-slate-900 dark:text-white">
                  {preset.name}
                </h3>
                <p className="text-[10px] font-medium leading-relaxed opacity-50 text-slate-600 dark:text-slate-400">
                  {preset.description}
                </p>
                {selectedPreset === preset.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full md:w-auto px-12 bg-slate-950 dark:bg-white text-white dark:text-black py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl"
        >
          {loading ? "Generating Design Environment..." : "Create Design & Open Builder"}
        </button>
      </form>
    </div>
  );
}