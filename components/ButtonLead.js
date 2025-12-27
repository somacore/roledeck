"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

// This component is used to collect the emails from the landing page
// You'd use this if your product isn't ready yet or you want to collect leads
// For instance: A popup to send a freebie, joining a waitlist, etc.
// It calls the /api/lead/route.js route and store a Lead document in the database
const ButtonLead = ({ extraStyle }) => {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    setIsLoading(true);
    try {
      await apiClient.post("/lead", { email });

      toast.success("Thanks for joining the waitlist!");

      // just remove the focus on the input
      inputRef.current.blur();
      setEmail("");
      setIsDisabled(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className={`w-full max-w-xs space-y-3 ${extraStyle ? extraStyle : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        required
        type="email"
        value={email}
        ref={inputRef}
        autoComplete="email"
        placeholder="tom@cruise.com"
        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg placeholder:opacity-60"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-lg bg-primary text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        type="submit"
        disabled={isDisabled || isLoading}
      >
        Join waitlist
        {isLoading ? (
          <span className="animate-spin rounded-full border-2 border-current border-t-transparent h-3 w-3"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ButtonLead;