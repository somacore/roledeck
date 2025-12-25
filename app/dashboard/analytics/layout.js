import { createClient } from "@/libs/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AnalyticsLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: decks } = await supabase
    .from("decks")
    .select("id, company, slug, is_public")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#080808] transition-colors duration-200">

      <section className="flex-1 overflow-y-auto h-screen relative">
        {children}
      </section>
    </div>
  );
}