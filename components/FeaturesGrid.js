/* eslint-disable @next/next/no-img-element */
import React from "react";

const features = [
  {
    title: "Collect user feedback",
    description:
      "Use your Insighto's board to let users submit features they want.",
    styles: "bg-primary text-white",
    demo: (
      <div className="overflow-hidden h-full flex items-stretch">
        <div className="w-full translate-x-12 bg-white/10 backdrop-blur-sm rounded-tl-3xl h-full p-8 border-l border-t border-white/20">
          <p className="font-black uppercase tracking-[0.2em] text-white/60 text-[10px] mb-4">
            Suggest a feature
          </p>
          <div
            className="relative h-full mr-12 bg-white/5 border border-white/10 rounded-xl p-6 transition-all group-hover:bg-white/10"
          >
            <div className="absolute left-6 top-6 group-hover:hidden flex items-center gap-1">
              <span className="text-sm font-bold opacity-80">Notifica</span>
              <span className="w-[2px] h-5 bg-white animate-pulse"></span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 duration-500 text-sm font-medium leading-relaxed">
              Notifications should be visible only on certain pages.
            </div>
            <div className="opacity-0 group-hover:opacity-100 duration-1000 flex items-center gap-0.5 mt-2">
              <span className="text-sm font-medium opacity-80 text-white/70">Terms & privacy pages don&apos;t need them</span>
              <span className="w-[2px] h-5 bg-white animate-pulse"></span>
            </div>
            <button className="absolute right-6 bottom-8 bg-white text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 duration-1000 transform group-hover:translate-y-0 translate-y-4 transition-all">
              Submit
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Prioritize features",
    description: "Users upvote features they want. You know what to ship next.",
    styles: "md:col-span-2 bg-slate-100 dark:bg-white/5 text-slate-950 dark:text-white",
    demo: (
      <div className="px-8 max-w-[600px] flex flex-col gap-4 overflow-hidden py-4">
        {[
          {
            text: "Add LemonSqueezy integration to the boilerplate",
            secondaryText: "Yes, ship this! ✅",
            votes: 48,
            transition: "group-hover:-mt-36 group-hover:md:-mt-28 duration-500",
          },
          {
            text: "A new pricing table for metered billing",
            secondaryText: "Maybe ship this 🤔",
            votes: 12,
          },
          {
            text: "A new UI library for the dashboard",
            secondaryText: "But don't ship that ❌",
            votes: 1,
          },
        ].map((feature, i) => (
          <div
            className={`p-6 bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-2xl flex justify-between items-center gap-6 shadow-sm transition-all ${feature?.transition}`}
            key={i}
          >
            <div className="text-left">
              <p className="font-black uppercase tracking-tight text-sm mb-1">{feature.text}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                {feature.secondaryText}
              </p>
            </div>
            <button
              className="flex flex-col items-center justify-center min-w-[64px] h-16 rounded-xl bg-primary text-white transition-transform hover:scale-105 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ease-in-out duration-150 -translate-y-0.5 group-hover:translate-y-0">
                <path d="m18 15-6-6-6 6" />
              </svg>
              <span className="text-sm font-black tabular-nums">{feature.votes}</span>
            </button>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Your brand, your board",
    description: "Customize your Insighto board with 7 themes.",
    styles: "md:col-span-2 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 text-slate-950 dark:text-white",
    demo: (
      <div className="flex left-0 w-full h-full pt-8 overflow-hidden -mt-4">
        <div className="-rotate-[8deg] flex min-w-max h-full lg:pt-4 transition-transform duration-500 group-hover:translate-x-4">
          {[
            {
              buttonStyles: "bg-primary text-white",
              css: "-ml-1 rotate-[6deg] w-80 h-80 z-30 bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-3xl group-hover:-ml-64 group-hover:opacity-0 group-hover:scale-75 transition-all duration-700 p-6 shadow-2xl",
            },
            {
              buttonStyles: "bg-blue-600 text-white",
              css: "rotate-[6deg] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 w-80 h-80 -mr-20 -ml-20 z-20 rounded-3xl p-6 shadow-xl",
            },
            {
              buttonStyles: "bg-green-600 text-white",
              css: "rotate-[6deg] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 z-10 w-80 h-80 rounded-3xl p-6 shadow-lg",
            },
            {
              buttonStyles: "bg-slate-950 text-white dark:bg-white dark:text-black",
              css: "rotate-[6deg] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 w-80 h-80 -ml-20 rounded-3xl p-6",
            },
            {
              buttonStyles: "bg-primary text-white",
              css: "rotate-[6deg] bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 w-80 h-80 -ml-10 -z-10 rounded-3xl p-6 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500",
            },
          ].map((theme, i) => (
            <div className={theme.css} key={i}>
              <div className="font-black uppercase tracking-[0.2em] text-slate-400 text-[9px] mb-6 text-left">
                Trending feedback
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-black/20 rounded-2xl flex justify-between items-center shadow-sm border border-black/5 dark:border-white/5">
                  <div className="text-left">
                    <p className="font-black uppercase text-[11px] mb-1">Clickable cards</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Make cards more accessible</p>
                  </div>
                  <button className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${theme.buttonStyles}`}>
                    8
                  </button>
                </div>
                <div className="p-4 bg-white dark:bg-black/20 rounded-2xl flex justify-between items-center shadow-sm border border-black/5 dark:border-white/5 opacity-60">
                  <div className="text-left">
                    <p className="font-black uppercase text-[11px] mb-1">Bigger images</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">UI refinement</p>
                  </div>
                  <button className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${theme.buttonStyles}`}>
                    5
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Discover new ideas",
    description: "Users can chat and discuss features.",
    styles: "bg-slate-900 text-white",
    demo: (
      <div className="text-white px-8 space-y-4 py-6">
        {[
          {
            id: 1,
            text: "Can we have a feature to add a custom domain to IndiePage?",
            userImg: "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
            userName: "Marc Lou",
            createdAt: "2024-09-01T00:00:00Z",
          },
          {
            id: 2,
            text: "I'd definitelly pay for that 🤩",
            userImg: "https://pbs.twimg.com/profile_images/1778434561556320256/knBJT1OR_400x400.jpg",
            userName: "Dan K.",
            createdAt: "2024-09-02T00:00:00Z",
            transition: "opacity-0 group-hover:opacity-100 duration-500 translate-x-1/4 group-hover:translate-x-0 transition-all delay-100",
          },
        ]?.map((reply) => (
          <div
            key={reply.id}
            className={`p-6 bg-white/5 border border-white/10 rounded-2xl text-left shadow-xl ${reply?.transition}`}
          >
            <div className="mb-4 text-sm font-medium leading-relaxed italic">&quot;{reply.text}&quot;</div>
            <div className="flex items-center gap-3">
              <img src={reply.userImg} alt={reply.userName} className="w-8 h-8 rounded-full border-2 border-white/20" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest">{reply.userName}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-30">
                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const FeaturesGrid = () => {
  return (
    <section className="flex justify-center items-center w-full bg-slate-50/50 dark:bg-white/[0.01] py-24 lg:py-40">
      <div className="flex flex-col max-w-7xl gap-20 px-8 w-full">
        <h2 className="max-w-4xl font-black text-5xl md:text-8xl tracking-tighter text-slate-950 dark:text-white uppercase leading-[0.85] text-left">
          Ship features <br /> users{" "}
          <span className="italic text-primary">really want</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${feature.styles} rounded-[2rem] flex flex-col gap-8 w-full h-[26rem] pt-10 overflow-hidden group shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1`}
            >
              <div className="px-10 space-y-3 text-left">
                <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">
                  {feature.title}
                </h3>
                <p className="text-sm font-medium opacity-60 leading-relaxed max-w-xs">{feature.description}</p>
              </div>
              <div className="flex-1 min-h-0">
                {feature.demo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;