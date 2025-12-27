import { categories, articles } from "./_assets/content";
import CardArticle from "./_assets/components/CardArticle";
import CardCategory from "./_assets/components/CardCategory";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `${config.appName} Blog | Stripe Chargeback Protection`,
  description:
    "Learn how to prevent chargebacks, how to accept payments online, and keep your Stripe account in good standing",
  canonicalUrlRelative: "/blog",
});

export default async function Blog() {
  const articlesToDisplay = articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 6);
  return (
    <>
      <section className="text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32">
        <h1 className="font-black text-4xl lg:text-7xl tracking-tighter text-slate-950 dark:text-white uppercase leading-[0.9] mb-8">
          The {config.appName} Blog
        </h1>
        <p className="text-lg md:text-xl font-medium opacity-60 leading-relaxed text-slate-600 dark:text-slate-400">
          Learn how to ship your startup in days, not weeks. And get the latest
          updates about the boilerplate
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 mb-24 md:mb-32 gap-8">
        {articlesToDisplay.map((article, i) => (
          <CardArticle
            article={article}
            key={article.slug}
            isImagePriority={i <= 2}
          />
        ))}
      </section>

      <section className="space-y-16">
        <p className="text-2xl md:text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase text-center">
          Browse articles by category
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CardCategory key={category.slug} category={category} tag="div" />
          ))}
        </div>
      </section>
    </>
  );
}