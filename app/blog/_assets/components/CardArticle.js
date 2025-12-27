import Link from "next/link";
import Image from "next/image";
import BadgeCategory from "./BadgeCategory";
import Avatar from "./Avatar";

// This is the article card that appears in the home page, in the category page, and in the author's page
const CardArticle = ({
  article,
  tag = "h2",
  showCategory = true,
  isImagePriority = false,
}) => {
  const TitleTag = tag;

  return (
    <article className="flex flex-col bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      {article.image?.src && (
        <Link
          href={`/blog/${article.slug}`}
          className="group overflow-hidden block aspect-video relative"
          title={article.title}
          rel="bookmark"
        >
          <Image
            src={article.image.src}
            alt={article.image.alt}
            width={600}
            height={338}
            priority={isImagePriority}
            placeholder="blur"
            className="w-full h-full object-center object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-in-out grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
        </Link>
      )}
      <div className="p-8 flex flex-col flex-1 gap-6">
        {/* CATEGORIES */}
        {showCategory && (
          <div className="flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <BadgeCategory category={category} key={category.slug} />
            ))}
          </div>
        )}

        {/* TITLE WITH RIGHT TAG */}
        <TitleTag className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight">
          <Link
            href={`/blog/${article.slug}`}
            className="text-slate-900 dark:text-white hover:text-primary transition-colors"
            title={article.title}
            rel="bookmark"
          >
            {article.title}
          </Link>
        </TitleTag>

        <div className="text-slate-500 dark:text-slate-400 space-y-6 flex-1 flex flex-col justify-between">
          {/* DESCRIPTION */}
          <p className="text-sm font-medium leading-relaxed opacity-80 line-clamp-3">{article.description}</p>

          {/* AUTHOR & DATE */}
          <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
            <Avatar article={article} />

            <span itemProp="datePublished" className="text-[10px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardArticle;