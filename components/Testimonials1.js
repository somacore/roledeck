import Image from "next/image";

// A beautiful single testimonial with a user name and and company logo logo
const Testimonial = () => {
  return (
    <section
      className="relative isolate overflow-hidden bg-white dark:bg-[#050505] px-8 py-24 sm:py-32 border-b border-black/5 dark:border-white/5"
      id="testimonials"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.100),theme(colors.white))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),theme(colors.black))] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white dark:bg-black shadow-lg ring-1 ring-slate-900/5 dark:ring-white/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      <div className="mx-auto max-w-2xl lg:max-w-5xl">
        <figure className="mt-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-1.5 sm:-rotate-1 shadow-sm">
              <Image
                width={320}
                height={320}
                className="rounded-lg max-w-[320px] md:max-w-[280px] lg:max-w-[320px] object-center border-2 border-white/10 shadow-md grayscale hover:grayscale-0 transition-all duration-500"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2488&q=80"
                alt="A testimonial from a happy customer"
              />
            </div>

            <div className="text-left">
              <blockquote className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none text-slate-950 dark:text-white">
                I got your boilerplate and having the payments setup with Stripe
                + user auth is a blessing. This will save me like a week of work
                for each new side project I spin up. I appreciate that is well
                documented, as well. 100% worth it!
              </blockquote>
              <figcaption className="mt-10 flex items-center justify-start gap-5">
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-widest text-slate-950 dark:text-white mb-0.5">
                    Amanda Lou
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Indie Maker &amp; Developer
                  </div>
                </div>

                <Image
                  width={150}
                  height={50}
                  className="w-20 md:w-24 invert dark:invert-0 opacity-40 hover:opacity-100 transition-opacity"
                  src="https://logos-world.net/wp-content/uploads/2020/10/Reddit-Logo.png"
                  alt="Reddit logo"
                />
              </figcaption>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Testimonial;