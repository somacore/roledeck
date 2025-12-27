import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Avoid hard-failing during build/prerender when envs
  // might not be available in the build environment.
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }

  return createBrowserClient(url, anonKey);
}
