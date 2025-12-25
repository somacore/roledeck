import { createClient } from "@/libs/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDeck } from "@/app/actions";

export default async function DeckViewPage({ params }) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch the specific deck by ID
  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .single();

  if (!deck) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="btn btn-ghost mb-8">
          ← Back to Dashboard
        </Link>

        <div className="flex justify-between items-start mb-8">
  <Link href="/dashboard" className="btn btn-ghost">
    ← Back
  </Link>
  
  <form action={deleteDeck}>
    <input type="hidden" name="id" value={deck.id} />
    <button type="submit" className="btn btn-error btn-outline btn-sm">
      Delete Deck
    </button>
  </form>
</div>

        <header className="mb-12">
          <h1 className="text-4xl font-extrabold mb-2">{deck.slug}</h1>
          <p className="text-base-content/60">
            Created on {new Date(deck.created_at).toLocaleDateString()}
          </p>
        </header>

        <section className="bg-base-200 p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-4 text-primary">Resume Content</h2>
          <div className="whitespace-pre-wrap leading-relaxed">
            {deck.resume_data?.content || "No content found."}
          </div>
        </section>
      </div>
    </main>
  );
}