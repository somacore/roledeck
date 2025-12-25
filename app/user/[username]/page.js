import { createClient } from "@/libs/supabase/server";
import { notFound } from "next/navigation";

export default async function PublicResume({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  // 1. Get the Profile ID from the handle
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", username)
    .single();

  if (!profile) return notFound();

  // 2. Fetch ONLY the deck marked as 'is_public'
  const { data: deck, error } = await supabase
    .from("decks")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .is("deleted_at", null)
    .single();

  // 3. If no public resume is set, we can show a 404 or a prompt
  if (!deck || error) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Resume Not Found</h1>
          <p className="opacity-60 max-w-xs mx-auto">
            You haven't marked a deck as your "Main Public Resume" in the dashboard yet.
          </p>
          <a href="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</a>
        </div>
      </main>
    );
  }

  // 4. Render the General Resume
  return (
    <div className="min-h-screen bg-base-200/50 py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <header className="bg-base-100 p-8 rounded-t-3xl border-x border-t border-base-300 shadow-sm">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-1">
            {username}
          </h1>
          <p className="text-primary font-mono font-bold text-lg">
            {deck.tracking_email || "General Portfolio"}
          </p>
        </header>

        <article className="bg-base-100 p-8 md:p-12 border border-base-300 shadow-xl rounded-b-3xl">
          <div className="prose prose-lg max-w-none text-base-content/80 leading-relaxed whitespace-pre-wrap">
            {deck.resume_data?.content}
          </div>
        </article>

        <footer className="mt-12 flex flex-col items-center gap-2 opacity-30 text-[10px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span>Verified Public Profile</span>
          </div>
          <p>© {new Date().getFullYear()} {username}</p>
        </footer>
      </main>
    </div>
  );
}