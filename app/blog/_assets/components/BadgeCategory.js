import Link from "next/link";

// This is the category badge that appears in the article page and in <CardArticle /> component
const Category = ({ category, extraStyle }) => {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary ${
        extraStyle ? extraStyle : ""
      }`}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      {category.titleShort}
    </Link>
  );
};

export default Category;