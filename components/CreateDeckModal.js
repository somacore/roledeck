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
        className="bg-slate-950 dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all cursor-pointer rounded-none border-none outline-none shadow-md"
      >
        New Deck
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#0c0c0c] w-full max-w-xl p-12 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh] border border-black/5 dark:border-white/5">
        <header className="flex justify-between items-start">
          <div className="space-y-1 text-left">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Configuration</h2>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">New Deck</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 cursor-pointer transition-opacity text-slate-900 dark:text-white">Close</button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">Target Company</label>
              <input name="company" required className="w-full bg-slate-50 dark:bg-white/[0.03] border border-transparent px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/20 outline-none transition-all rounded-none" placeholder="e.g. Vercel" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">URL Slug</label>
              <input name="slug" required className="w-full bg-slate-50 dark:bg-white/[0.03] border border-transparent px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/20 outline-none transition-all rounded-none" placeholder="frontend-engineer" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">Resume PDF</label>
            <input type="file" name="resume_file" accept=".pdf" required className="w-full text-[10px] font-bold uppercase py-2 cursor-pointer text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">Tailored Cover Letter</label>
            <textarea name="cover_letter" rows={5} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-transparent px-4 py-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-black/20 outline-none resize-none transition-all rounded-none" placeholder="Paste your tailored letter here..." />
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.03] p-4 transition-colors">
            <input type="checkbox" name="is_public" id="is_public" className="accent-primary w-4 h-4 cursor-pointer" />
            <label htmlFor="is_public" className="text-[9px] font-black uppercase tracking-widest cursor-pointer text-slate-900 dark:text-white">Mark as Main Deck</label>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-950 dark:bg-white text-white dark:text-black py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
          >
            {loading ? "Parsing & Deploying..." : "Initialize Deck"}
          </button>
        </form>
      </div>
    </div>
  );
}