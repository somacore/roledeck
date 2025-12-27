import Image from "next/image";
import { authors, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export async function generateMetadata({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);

  return getSEOTags({
    title: `${author.name}, Author at ${config.appName}'s Blog`,
    description: `${author.name}, Author at ${config.appName}'s Blog`,
    canonicalUrlRelative: `/blog/author/${author.slug}`,
  });
}

export default async function Author({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);
  const articlesByAuthor = articles
    .filter((article) => article.author.slug === author.slug)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <>
      <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 mt-12 mb-24 md:mb-32 text-left items-start">
        <div className="flex-1 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Authors
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
            {author.name}
          </h1>
          <p className="text-lg font-black uppercase tracking-widest text-slate-400">{author.job}</p>
          <p className="text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            {author.description}
          </p>
        </div>

        <div className="max-md:order-first flex flex-col gap-6 shrink-0">
          <div className="relative group">
            <Image
              src={author.avatar}
              width={256}
              height={256}
              alt={author.name}
              priority={true}
              className="rounded-3xl w-[14rem] md:w-[18rem] grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl border-4 border-white dark:border-black"
            />
          </div>

          {author.socials?.length > 0 && (
            <div className="flex gap-3">
              {author.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all hover:bg-slate-950 dark:hover:bg-white hover:text-white dark:hover:text-black group"
                  title={`Go to ${author.name} profile on ${social.name}`}
                  target="_blank"
                >
                  <div className="w-5 h-5 fill-current opacity-60 group-hover:opacity-100 transition-opacity">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-16">
        <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-950 dark:text-white uppercase text-center">
          Most recent articles by {author.name}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {articlesByAuthor.map((article) => (
            <CardArticle key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}