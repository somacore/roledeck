"use client";

import { useState } from "react";
import { createDeck } from "@/app/actions";
import toast from "react-hot-toast";

export default function CreateDeckModal({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      const result = await createDeck(formData);
      if (result?.error) {
        toast.error(result.message);
      } else {
        toast.success("Deck deployed successfully");
        setIsOpen(false);
        if (onComplete) onComplete();
      }
    } catch (err) {
      toast.error("Deployment failed");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-950 dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#a855f7] hover:text-white transition-all cursor-pointer"
      >
        New Deck
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#0c0c0c] w-full max-w-xl p-12 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh]">
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a855f7]">Configuration</h2>
            <h3 className="text-2xl font-black uppercase tracking-tighter">New Deck</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 cursor-pointer">Close</button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Target Company</label>
              <input name="company" required className="w-full bg-slate-50 dark:bg-white/[0.03] border-none px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#a855f7] outline-none" placeholder="e.g. Vercel" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40">URL Slug</label>
              <input name="slug" required className="w-full bg-slate-50 dark:bg-white/[0.03] border-none px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#a855f7] outline-none" placeholder="frontend-engineer" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Resume PDF</label>
            <input type="file" name="resume_file" accept=".pdf" required className="w-full text-[10px] font-bold uppercase py-2" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Tailored Cover Letter</label>
            <textarea name="cover_letter" rows={5} className="w-full bg-slate-50 dark:bg-white/[0.03] border-none px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-[#a855f7] outline-none resize-none" placeholder="Paste your tailored letter here..." />
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.03] p-4">
            <input type="checkbox" name="is_public" id="is_public" className="accent-[#a855f7] w-4 h-4" />
            <label htmlFor="is_public" className="text-[9px] font-black uppercase tracking-widest">Mark as Main Deck</label>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-950 dark:bg-white text-white dark:text-black py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#a855f7] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Parsing & Deploying..." : "Initialize Deck"}
          </button>
        </form>
      </div>
    </div>
  );
}