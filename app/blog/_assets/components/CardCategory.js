import Link from "next/link";

// This is the category card that appears in the home page and in the category page
const CardCategory = ({ category, tag = "h2" }) => {
  const TitleTag = tag;

  return (
    <Link
      className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl transition-all hover:bg-slate-950 dark:hover:bg-white group"
      href={`/blog/category/${category.slug}`}
      title={category.title}
      rel="tag"
    >
      <TitleTag className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 group-hover:text-white dark:group-hover:text-black transition-colors">
        {category?.titleShort || category.title}
      </TitleTag>
    </Link>
  );
};

export default CardCategory;