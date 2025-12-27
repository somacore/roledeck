/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, [supabase]);

  const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-primary/20";

  if (user) {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`${baseStyles} ${extraStyle ? extraStyle : ""}`}
      >
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-black/10 dark:bg-white/10 flex justify-center items-center rounded-full shrink-0 text-xs uppercase">
            {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0)}
          </span>
        )}
        {user?.user_metadata?.name || user?.email || "Account"}
      </Link>
    );
  }

  return (
    <Link
      className={`${baseStyles} ${extraStyle ? extraStyle : ""}`}
      href={config.auth.loginUrl}
    >
      {text}
    </Link>
  );
};

export default ButtonSignin;