"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { uploadStudioAsset } from "@/app/actions";
import Link from "next/link";
import toast from "react-hot-toast";

/**
 * Helper to generate a unique ID safely in non-secure development contexts.
 */
const safeUUID = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function StudioBuilder() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    async function fetchTemplate() {
      const { data, error } = await supabase.from("templates").select("*").eq("id", id).single();
      if (error || !data) { router.push("/dashboard/studio"); return; }
      
      const normalizedSections = (data.config.sections || []).map(section => ({
        ...section,
        id: section.id || safeUUID()
      }));

      const normalizedData = {
        ...data,
        config: { ...data.config, sections: normalizedSections }
      };

      setTemplate(normalizedData);
      setLoading(false);
    }
    fetchTemplate();
  }, [id, supabase, router]);

  useEffect(() => {
    async function getPreviews() {
      const gallery = template?.config.sections.find(s => s.type === 'gallery');
      if (!gallery?.content.images) return;
      const urls = {};
      for (const img of gallery.content.images) {
        if (img.path) {
          const { data } = await supabase.storage.from('studio-assets').createSignedUrl(img.path, 3600);
          if (data?.signedUrl) urls[img.id] = data.signedUrl;
        }
      }
      setPreviews(urls);
    }
    if (template) getPreviews();
  }, [template, supabase]);

  const saveTemplate = async (updatedConfig) => {
    setSaving(true);
    await supabase.from("templates").update({ config: updatedConfig, updated_at: new Date().toISOString() }).eq("id", id);
    setTemplate({ ...template, config: updatedConfig });
    setSaving(false);
  };

  const updateSectionContent = (index, newContent) => {
    const updatedSections = [...template.config.sections];
    updatedSections[index].content = { ...updatedSections[index].content, ...newContent };
    saveTemplate({ ...template.config, sections: updatedSections });
  };

  const handleAssetUpload = async (e, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadStudioAsset(formData);
    if (result.success) {
      const currentImages = template.config.sections[sectionIndex].content.images || [];
      updateSectionContent(sectionIndex, { images: [...currentImages, { path: result.path, id: safeUUID() }] });
    }
  };

  const addSection = (type) => {
    const presets = {
      hero: { title: "Enter Headline", subtitle: "Enter Role" },
      gallery: { images: [] },
      portfolio_links: { links: [{ label: "My GitHub", url: "https://github.com" }] },
      testimonials: { items: [{ text: "Amazing work!", author: "Client", role: "CEO" }] },
      resume_snapshot: {}
    };
    const newSection = { id: safeUUID(), type, content: presets[type] };
    saveTemplate({ ...template.config, sections: [...(template.config.sections || []), newSection] });
  };

  const moveSection = (index, direction) => {
    const updatedSections = [...template.config.sections];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= updatedSections.length) return;
    [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]];
    saveTemplate({ ...template.config, sections: updatedSections });
  };

  if (loading) return <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Syncing_Builder...</div>;

  return (
    <div className="space-y-12 animate-fade-in pb-32 text-left">
      <header className="flex justify-between items-end pb-8 border-b border-black/5 dark:border-white/5">
        <div className="space-y-2">
          <Link href="/dashboard/studio" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">← Library</Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">{template.name}</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">{saving ? "Syncing..." : "Environment_Active"}</p>
        </div>
        <div className="flex gap-2">
          {["hero", "gallery", "portfolio_links", "testimonials", "resume_snapshot"].map((type) => (
            <button key={type} onClick={() => addSection(type)} className="px-3 py-1.5 border border-black/10 dark:border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
              + {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6 max-w-4xl">
        {template.config.sections?.map((section, idx) => (
          <div key={section.id} className="bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 overflow-hidden group">
            <div className="p-6 flex items-center justify-between bg-white dark:bg-black/20 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveSection(idx, -1)} className="text-[10px] hover:text-primary cursor-pointer">▲</button>
                  <button onClick={() => moveSection(idx, 1)} className="text-[10px] hover:text-primary cursor-pointer">▼</button>
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{idx + 1}. {section.type.replace('_', ' ')}</h4>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingSection(editingSection === idx ? null : idx)} className="text-[9px] font-black uppercase tracking-widest text-primary cursor-pointer underline underline-offset-4 decoration-primary/20">Edit</button>
                <button onClick={() => {
                  const updated = [...template.config.sections];
                  updated.splice(idx, 1);
                  saveTemplate({ ...template.config, sections: updated });
                }} className="text-[9px] font-black uppercase tracking-widest text-red-500 cursor-pointer opacity-40 hover:opacity-100 transition-opacity">Remove</button>
              </div>
            </div>

            {editingSection === idx && (
              <div className="p-8 space-y-8 bg-white dark:bg-transparent border-t border-primary/10 animate-fade-in">
                {section.type === 'hero' && (
                  <div className="grid grid-cols-2 gap-4">
                    <input className="text-xs font-bold" value={section.content.title} onChange={(e) => updateSectionContent(idx, { title: e.target.value })} placeholder="Headline" />
                    <input className="text-xs font-bold" value={section.content.subtitle} onChange={(e) => updateSectionContent(idx, { subtitle: e.target.value })} placeholder="Sub-headline" />
                  </div>
                )}

                {section.type === 'gallery' && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {section.content.images?.map((img, iIdx) => (
                      <div key={img.id} className="aspect-square bg-slate-100 dark:bg-white/5 relative overflow-hidden group/img">
                        {previews[img.id] && <img src={previews[img.id]} className="object-cover w-full h-full" alt="Secure Asset" />}
                        <button onClick={() => {
                          const updatedImgs = [...section.content.images];
                          updatedImgs.splice(iIdx, 1);
                          updateSectionContent(idx, { images: updatedImgs });
                        }} className="absolute inset-0 bg-red-500/80 text-white text-[8px] font-black uppercase opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">Remove</button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center cursor-pointer hover:border-primary">
                      <span className="text-xl font-light opacity-30">+</span>
                      <input type="file" className="hidden" onChange={(e) => handleAssetUpload(e, idx)} />
                    </label>
                  </div>
                )}

                {section.type === 'portfolio_links' && (
                  <div className="space-y-4">
                    {section.content.links?.map((link, lIdx) => (
                      <div key={lIdx} className="flex gap-2 items-center">
                        <input className="flex-1 text-xs" value={link.label} onChange={(e) => {
                          const newLinks = [...section.content.links];
                          newLinks[lIdx].label = e.target.value;
                          updateSectionContent(idx, { links: newLinks });
                        }} placeholder="Label" />
                        <input className="flex-1 text-xs" value={link.url} onChange={(e) => {
                          const newLinks = [...section.content.links];
                          newLinks[lIdx].url = e.target.value;
                          updateSectionContent(idx, { links: newLinks });
                        }} placeholder="URL" />
                        <button onClick={() => {
                          const newLinks = [...section.content.links];
                          newLinks.splice(lIdx, 1);
                          updateSectionContent(idx, { links: newLinks });
                        }} className="text-red-500 text-[10px] cursor-pointer opacity-30 hover:opacity-100">×</button>
                      </div>
                    ))}
                    <button onClick={() => updateSectionContent(idx, { links: [...(section.content.links || []), { label: "", url: "" }] })} className="text-[8px] font-black uppercase text-primary underline decoration-primary/20 cursor-pointer">+ Add Link</button>
                  </div>
                )}

                {section.type === 'testimonials' && (
                  <div className="space-y-6">
                    {section.content.items?.map((item, tIdx) => (
                      <div key={tIdx} className="p-4 bg-slate-50 dark:bg-white/5 space-y-3 relative group/test">
                        <button onClick={() => {
                          const newItems = [...section.content.items];
                          newItems.splice(tIdx, 1);
                          updateSectionContent(idx, { items: newItems });
                        }} className="absolute top-2 right-2 text-red-500 text-[10px] cursor-pointer opacity-0 group-hover/test:opacity-100 transition-opacity">Remove</button>
                        <textarea className="w-full text-xs" value={item.text} onChange={(e) => {
                          const newItems = [...section.content.items];
                          newItems[tIdx].text = e.target.value;
                          updateSectionContent(idx, { items: newItems });
                        }} placeholder="Testimonial text" />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="text-[10px]" value={item.author} onChange={(e) => {
                            const newItems = [...section.content.items];
                            newItems[tIdx].author = e.target.value;
                            updateSectionContent(idx, { items: newItems });
                          }} placeholder="Author Name" />
                          <input className="text-[10px]" value={item.role} onChange={(e) => {
                            const newItems = [...section.content.items];
                            newItems[tIdx].role = e.target.value;
                            updateSectionContent(idx, { items: newItems });
                          }} placeholder="Company/Role" />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => updateSectionContent(idx, { items: [...(section.content.items || []), { text: "", author: "", role: "" }] })} className="text-[8px] font-black uppercase text-primary underline decoration-primary/20 cursor-pointer">+ Add Testimonial</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}