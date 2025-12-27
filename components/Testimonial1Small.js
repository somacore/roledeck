import Image from "next/image";

// A one or two sentences testimonial from a customer.
const Testimonial1Small = () => {
  return (
    <section className="bg-white dark:bg-transparent">
      <div className="space-y-8 max-w-lg mx-auto px-8 py-24 md:py-32">
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-yellow-500 drop-shadow-sm"
              key={i}
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        <div className="text-lg md:text-xl leading-relaxed space-y-4 max-w-md mx-auto text-center font-medium italic text-slate-700 dark:text-slate-300">
          <p>
            <span className="bg-yellow-500/10 text-slate-900 dark:text-white px-2 py-0.5 rounded shadow-sm border border-yellow-500/10 not-italic font-black uppercase tracking-tighter text-sm mx-1">
              I don&apos;t want to pay Stripe $2 for every invoice.
            </span>{" "}
            I don&apos;t want to spend 10 minutes manually crafting every
            invoice either.
          </p>
          <p className="opacity-80">
            Zenvoice solved this problem once and for all. The app is simple,
            but it nails the job perfectly.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 border-t border-black/5 dark:border-white/5 pt-8">
          <Image
            className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-white dark:border-black shadow-lg"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt={`XYZ feedback for ZenVoice`}
            width={48}
            height={48}
          />
          <div className="text-left">
            <p className="font-black uppercase tracking-tighter text-slate-900 dark:text-white">Someone Nice</p>
            <p className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">23.1K followers on 𝕏</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial1Small;