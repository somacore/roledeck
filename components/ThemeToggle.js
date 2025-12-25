"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-48 bg-white/5 animate-pulse rounded-full" />;

  const options = ["light", "dark", "system"];

  return (
    <div className="relative flex items-center bg-[#111] border border-white/10 rounded-full p-1 h-9">
      {/* Animated Background Slider */}
      <div 
        className="absolute h-7 bg-white/10 rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: 'calc(33.33% - 4px)',
          transform: `translateX(${options.indexOf(theme) * 100}%)`,
          left: '2px'
        }}
      />
      
      {options.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`relative z-10 flex-1 px-4 text-[9px] font-black uppercase tracking-widest transition-colors duration-200 ${
            theme === t ? "text-primary" : "text-white/40 hover:text-white"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}