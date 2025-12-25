"use client";

import { useState } from "react";

export default function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false); // ✅ Track the flash state

  const handleCopy = async () => {
    if (!email) return;

    // Trigger the green flash effect immediately
    setFlash(true);
    setTimeout(() => setFlash(false), 600); // Fade back after 600ms

    // Modern Clipboard API check
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.error("Modern clipboard failed, trying fallback:", err);
      }
    }

    // Fallback for insecure contexts (lvh.me / non-https)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      // ✅ Dynamic background: flashes green-400 and transitions back to white
      className={`border-2 border-black text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 cursor-pointer flex items-center gap-2 no-print ${
        flash ? "bg-green-400" : "bg-white hover:bg-gray-50"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
      </svg>
      {copied ? "Copied!" : "Copy Email"}
    </button>
  );
}