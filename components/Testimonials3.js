import Image from "next/image";
import config from "@/config";

// The list of your testimonials.
const list = [
  {
    username: "marclou",
    name: "Marc Lou",
    text: "Really easy to use. The tutorials are really useful and explains how everything works. Hope to ship my next project really fast!",
    img: "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
  },
  {
    username: "the_mcnaveen",
    name: "Naveen",
    text: "Setting up everything from the ground up is a really hard, and time consuming process. What you pay for will save your time for sure.",
  },
  {
    username: "wahab",
    name: "Wahab Shaikh",
    text: "Easily saves 15+ hrs for me setting up trivial stuff. Now, I can directly focus on shipping features rather than hours of setting up the same technologies from scratch. Feels like a super power! :D",
  },
];

const Testimonial = ({ i }) => {
  const testimonial = list[i];
  if (!testimonial) return null;

  return (
    <li key={i}>
      <figure className="relative max-w-lg h-full p-8 md:p-10 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2rem] flex flex-col text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <blockquote className="relative flex-1">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic text-sm md:text-base">
            &quot;{testimonial.text}&quot;
          </p>
        </blockquote>
        <figcaption className="relative flex items-center justify-between gap-4 pt-8 mt-8 border-t border-black/5 dark:border-white/5">
          <div className="text-left">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white md:mb-0.5">
              {testimonial.name}
            </div>
            {testimonial.username && (
              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                @{testimonial.username}
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 shrink-0 border-2 border-white dark:border-black shadow-sm">
            {testimonial.img ? (
              <Image className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src={testimonial.img} alt={testimonial.name} width={48} height={48} />
            ) : (
              <span className="w-12 h-12 rounded-full flex justify-center items-center text-sm font-black uppercase bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white">
                {testimonial.name.charAt(0)}
              </span>
            )}
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials" className="bg-white dark:bg-transparent">
      <div className="py-24 px-8 max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col text-center w-full space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
            212 makers are already shipping faster!
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-60 leading-relaxed text-slate-600 dark:text-slate-400">
            Don&apos;t take our word for it. Here&apos;s what they have to say about ShipFast.
          </p>
        </div>
        <ul role="list" className="flex flex-col items-center lg:flex-row lg:items-stretch justify-center gap-8">
          {[...Array(3)].map((e, i) => (<Testimonial key={i} i={i} />))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;