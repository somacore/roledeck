"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";

/**
 * SECTION COMPONENTS
 */

const HeroSection = ({ content }) => (
  <section className="py-24 px-6 text-center space-y-6">
    <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none text-slate-950 dark:text-white">
      {content.title || "Identity"}
    </h1>
    <p className="max-w-xl mx-auto text-lg opacity-60 font-medium leading-relaxed text-slate-600 dark:text-slate-400">
      {content.subtitle || "Professional Profile"}
    </p>
  </section>
);

const GallerySection = ({ content }) => {
  const [signedUrls, setSignedUrls] = useState({});
  const supabase = createClient();

  useEffect(() => {
    async function getLinks() {
      if (!content.images?.length) return;
      const urls = {};
      for (const img of content.images) {
        if (img.path) {
          const { data } = await supabase.storage.from('studio-assets').createSignedUrl(img.path, 3600);
          if (data?.signedUrl) urls[img.id] = data.signedUrl;
        }
      }
      setSignedUrls(urls);
    }
    getLinks();
  }, [content.images, supabase]);

  return (
    <section className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {content.images?.map((img, i) => (
        <div key={img.id || i} className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 group shadow-sm hover:shadow-xl transition-all relative">
          {signedUrls[img.id] ? (
            <Image src={signedUrls[img.id]} alt="Portfolio Asset" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-20 italic">
              {img.path ? "Loading..." : "Empty_Slot"}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

const PortfolioLinksSection = ({ content }) => (
  <section className="py-20 space-y-8">
    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Featured Links</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {content.links?.map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex justify-between items-center group hover:bg-primary transition-all">
          <span className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-white">{link.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:text-white transition-all">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      ))}
    </div>
  </section>
);

const TestimonialsSection = ({ content }) => (
  <section className="py-20 space-y-12">
    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary text-center">Wall of Proof</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {content.items?.map((item, i) => (
        <div key={i} className="p-10 bg-white dark:bg-white/[0.01] border-l-4 border-primary shadow-sm space-y-4 italic">
          <p className="text-lg text-slate-700 dark:text-slate-300">"{item.text}"</p>
          <div className="not-italic text-[10px] font-black uppercase tracking-widest opacity-40">
            — {item.author}, {item.role}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const ResumeSnapshotSection = ({ resumeData }) => {
  if (!resumeData) return null;
  return (
    <section className="py-20 space-y-12 border-t border-black/5 dark:border-white/5 text-left">
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Resume Snapshot</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          {resumeData.experience?.slice(0, 3).map((job, i) => (
            <div key={i}>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">{job.role}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{job.company} — {job.dates}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40 text-slate-900 dark:text-white">Core Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills?.map((skill, i) => (
              <span key={i} className="bg-slate-100 dark:bg-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-400">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function StudioRenderer({ config, resumeData }) {
  if (!config?.sections) return null;
  return (
    <div className="space-y-4 animate-fade-in">
      {config.sections.map((section, index) => {
        switch (section.type) {
          case "hero": return <HeroSection key={index} content={section.content} />;
          case "gallery": return <GallerySection key={index} content={section.content} />;
          case "portfolio_links": return <PortfolioLinksSection key={index} content={section.content} />;
          case "testimonials": return <TestimonialsSection key={index} content={section.content} />;
          case "resume_snapshot": return <ResumeSnapshotSection key={index} resumeData={resumeData} />;
          default: return null;
        }
      })}
    </div>
  );
}