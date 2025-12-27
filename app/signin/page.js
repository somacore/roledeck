"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import config from "@/config";

// This a login/singup page for Supabase Auth.
// Successfull login redirects to /api/auth/callback where the Code Exchange is processed (see app/api/auth/callback/route.js).
export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignup = async (e, options) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = window.location.origin + "/api/auth/callback";

      if (type === "oauth") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
          },
        });
      } else if (type === "magic_link") {
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectURL,
          },
        });

        toast.success("Check your emails!");

        setIsDisabled(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/" className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Home
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-12 uppercase text-slate-900 dark:text-white">
        Sign-in to {config.appName}{" "}
      </h1>

      <div className="space-y-8 max-w-xl mx-auto">
        <button
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-bold transition-all rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={(e) =>
            handleSignup(e, { type: "oauth", provider: "google" })
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
          )}
          Sign-up with Google
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-slate-400">OR</span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
        </div>

        <form
          className="flex flex-col w-full space-y-4"
          onSubmit={(e) => handleSignup(e, { type: "magic_link" })}
        >
          <input
            required
            type="email"
            value={email}
            autoComplete="email"
            placeholder="tom@cruise.com"
            className="w-full bg-transparent border border-slate-200 dark:border-white/10 px-4 py-3 text-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg placeholder:opacity-40"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-lg bg-primary text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={isLoading || isDisabled}
            type="submit"
          >
            {isLoading && (
              <span className="animate-spin rounded-full border-2 border-current border-t-transparent h-3 w-3 mr-2"></span>
            )}
            Send Magic Link
          </button>
        </form>
      </div>
    </main>
  );
}