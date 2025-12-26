"use client";

import { useState } from "react";
import { duplicateDeck } from "@/app/actions";

export default function DuplicateDeckButton({ deck, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: `${deck.company} (Copy)`,
    slug: `${deck.slug}-copy`,
    cover_letter: deck.cover_letter?.content || ""
  });

  const handleDuplicate = async () => {
    setLoading(true);
    const result = await duplicateDeck(deck.id, formData);
    setLoading(false);
    
    if (result.success) {
      setIsOpen(false);
      if (onComplete) onComplete();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white underline decoration-[#a855f7]/40 underline-offset-8 hover:decoration-[#a855f7] cursor-pointer"
      >
        Duplicate
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white/20 p-8 max-w-lg w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">Duplicate Portal</h2>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">Target Company</label>
                <input 
                  className="w-full border-2 border-black dark:border-white/20 p-3 font-bold text-sm bg-white dark:bg-black text-black dark:text-white focus:border-[#a855f7] outline-none transition-colors" 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">URL Slug</label>
                <input 
                  className="w-full border-2 border-black dark:border-white/20 p-3 font-bold text-sm bg-white dark:bg-black text-black dark:text-white focus:border-[#a855f7] outline-none transition-colors" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">Tailored Intro</label>
                <textarea 
                  className="w-full border-2 border-black dark:border-white/20 p-3 h-32 text-sm bg-white dark:bg-black text-black dark:text-white focus:border-[#a855f7] outline-none transition-colors font-medium" 
                  value={formData.cover_letter} 
                  onChange={e => setFormData({...formData, cover_letter: e.target.value})}
                />
              </div>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleDuplicate} 
                  disabled={loading}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Duplicating..." : "Create Duplicate"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)} 
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:underline text-black dark:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}