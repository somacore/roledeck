"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/**
 * A utility component to copy portal URLs to the clipboard.
 */
export default function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      // Reset icon state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-slate-400 hover:text-primary transition-all cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
      title="Copy Portal Link"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.242l7-7a3 3 0 000-4.242zm-5.657 2.828l-2.121 2.121a1 1 0 001.414 1.414l2.121-2.121a1 1 0 00-1.414-1.414zm2.829 2.829l-2.121 2.121a1 1 0 001.414 1.414l2.121-2.121a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}