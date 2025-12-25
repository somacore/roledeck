"use client";

import { useState } from "react";
import { sendResumeEmail } from "@/app/actions"; // We'll create this next

export default function SendResumeButton({ portalUrl, companyName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    
    const result = await sendResumeEmail(email, portalUrl, companyName);
    
    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
        setEmail("");
      }, 2000);
    } else {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border-2 border-black text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 no-print"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
        Send Portal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
          <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Forward Portal</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">Send this tailored portal link directly to a recruiter or colleague.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recruiter@company.com"
                  className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:bg-gray-50 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#7c3aed] transition-all disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Send Now"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Cancel
                </button>
              </div>
              {status === "error" && <p className="text-red-500 text-[10px] font-bold uppercase mt-2">Failed to send. Try again.</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}