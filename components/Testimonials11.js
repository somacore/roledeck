"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import config from "@/config";

// Use this object to add an icon to the testimonial (optional)
const refTypes = {
  productHunt: {
    id: "product_hunt",
    ariaLabel: "See user review on Product Hunt",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.245 26.256" className="w-[18px] h-[18px]">
        <path d="M26.254 13.128c0 7.253-5.875 13.128-13.128 13.128S-.003 20.382-.003 13.128 5.872 0 13.125 0s13.128 5.875 13.128 13.128" fill="#da552f" />
        <path d="M14.876 13.128h-3.72V9.2h3.72c1.083 0 1.97.886 1.97 1.97s-.886 1.97-1.97 1.97m0-6.564H8.53v13.128h2.626v-3.938h3.72c2.538 0 4.595-2.057 4.595-4.595s-2.057-4.595-4.595-4.595" fill="#fff" />
      </svg>
    ),
  },
  twitter: {
    id: "twitter",
    ariaLabel: "See user post on Twitter",
    svg: (
      <svg className="w-5 h-5 fill-[#00aCee]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
      </svg>
    ),
  },
  video: { id: "video" },
  other: { id: "other" },
};

// The list of your testimonials.
const list = [
  {
    username: "marclou",
    name: "Marc Lou",
    text: "Really easy to use. The tutorials are really useful and explains how everything works. Hope to ship my next project really fast!",
    type: refTypes.twitter,
    link: "https://twitter.com/marc_louvion",
    img: "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
  },
  {
    username: "the_mcnaveen",
    name: "Naveen",
    text: "Setting up everything from the ground up is a really hard, and time consuming process. What you pay for will save your time for sure.",
    type: refTypes.twitter,
    link: "https://twitter.com/the_mcnaveen",
  },
  {
    username: "wahab",
    name: "Wahab Shaikh",
    text: "Easily saves 15+ hrs for me setting up trivial stuff. Now, I can directly focus on shipping features rather than hours of setting up the same technologies from scratch. Feels like a super power! :D",
    type: refTypes.productHunt,
    link: "https://www.producthunt.com/products/shipfast-2/reviews?review=667971",
  },
  {
    name: "Sean",
    text: "Just purchased and cloned and *holy shit!* I realllyyy like what I'm seeing here!",
    type: refTypes.other,
  },
  {
    username: "krishna",
    name: "Krishna Kant",
    text: "Finally a good boilerplate for Nextjs, now I dont have to cry about it comparing with laravel ecosystem.",
    type: refTypes.productHunt,
    link: "https://www.producthunt.com/posts/shipfast-2?comment=2707061",
  },
  {
    username: "imgyf",
    name: "Yifan Goh",
    text: "It's a game changer 🚀 Comes with easy to follow tutorial, and saves you a ton of time. What's not to love?",
    type: refTypes.twitter,
    link: "https://twitter.com/imgyf/status/1697549891080532236?s=20",
  },
  {
    name: "Yazdun",
    text: "Yo Marc, I got the boilerplate, it's fantastic man you just save me 10 hours on each project",
    type: refTypes.other,
  },
  {
    name: "Marc Lou",
    text: "The tool is exactly what I didn't even know I needed.",
    videoPoster: "https://d1wkquwg5s1b04.cloudfront.net/demo/marcPoster.jpg",
    videoSrc: "https://d1wkquwg5s1b04.cloudfront.net/demo/marcVideo.mp4",
    videoHeight: 250,
    videoWidth: 500,
    videoType: "video/mp4",
    type: refTypes.video,
  },
  {
    username: "zawwadx",
    name: "Zawwad Ul Sami",
    text: "It's an amazing minimalist, lightweight boilerplate with well-organized code. It has almost all the core features you would want in a SaaS boilerplate. As a new team last year it actually took us months to build a similar set of features at a stable level.",
    type: refTypes.twitter,
  },
  {
    username: "dan",
    name: "Dan Mindru",
    text: "Probably one of the most powerful things you can 'npm install' that I've seen",
    type: refTypes.productHunt,
    link: "https://www.producthunt.com/posts/shipfast-2?comment=2706763",
  },
  {
    username: "VicPivots",
    name: "Victor Abeledo",
    text: "Marc, I got your boilerplate and having the payments setup with Stripe + user auth is a blessing. This will save me like a week of work for each new side project I spin up. I appreciate that is well documented, as well. 100% worth it 🚀🚀🚀",
    type: refTypes.twitter,
    link: "https://twitter.com/VicPivots/status/1697352442986250413?s=20",
  },
];

const Testimonial = ({ i }) => {
  const testimonial = list[i];
  if (!testimonial) return null;
  if (testimonial.type === refTypes.video) return <VideoTestimonial i={i} />;

  return (
    <li key={i}>
      <figure className="relative h-full p-8 bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <blockquote className="relative">
          <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 italic">
            &quot;{testimonial.text}&quot;
          </p>
        </blockquote>
        <figcaption className="relative flex items-center justify-start gap-4 pt-6 mt-6 border-t border-black/5 dark:border-white/5">
          <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 shrink-0 border-2 border-white dark:border-black shadow-sm">
            {testimonial.img ? (
              <Image className="w-10 h-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src={testimonial.img} alt={testimonial.name} width={40} height={40} />
            ) : (
              <span className="w-10 h-10 rounded-full flex justify-center items-center text-xs font-black uppercase bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white">{testimonial.name.charAt(0)}</span>
            )}
          </div>
          <div className="w-full flex items-end justify-between gap-2 text-left">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-950 dark:text-white">{testimonial.name}</div>
              {testimonial.username && (
                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">@{testimonial.username}</div>
              )}
            </div>
            {testimonial.link && testimonial.type?.svg && (
              <a href={testimonial.link} target="_blank" className="shrink-0 opacity-30 hover:opacity-100 transition-opacity" aria-label={testimonial.type?.ariaLabel}>
                {testimonial.type?.svg}
              </a>
            )}
          </div>
        </figcaption>
      </figure>
    </li>
  );
};

const VideoTestimonial = ({ i }) => {
  const vidRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vidRef.current?.readyState != 0) setIsLoading(false);
  }, [vidRef?.current?.readyState]);

  const handlePlayVideo = () => {
    if (isPlaying) { vidRef.current.pause(); setIsPlaying(false); }
    else { vidRef.current.play(); setIsPlaying(true); if (vidRef.current?.readyState === 0) setIsLoading(true); }
  };

  const testimonial = list[i];
  if (!testimonial) return null;

  return (
    <li key={i} className="break-inside-avoid max-md:flex justify-center bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-sm">
      <div className="relative w-full">
        {isLoading && (
          <div className="z-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
          </div>
        )}
        <video className="w-full" ref={vidRef} poster={testimonial.videoPoster} preload="metadata" playsInline width={testimonial.videoWidth} height={testimonial.videoHeight} onLoadedData={() => setIsLoading(false)}>
          <source src={testimonial.videoSrc} type={testimonial.videoType || "video/mp4"} />
        </video>
        <div className="absolute w-full bottom-0 z-20 p-4">
          <div className="flex justify-between items-end">
            <button className="cursor-pointer group" type="button" onClick={handlePlayVideo}>
              {isPlaying ? (
                <svg className="w-12 h-12 fill-white shadow-xl group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-12 h-12 fill-white shadow-xl group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {!isPlaying && (
              <div className="text-right">
                <p className="text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">{testimonial.name}</p>
                <div className="flex justify-end gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-500 drop-shadow-md">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-primary text-white text-xs leading-relaxed font-bold p-6 select-none text-left">
        &quot;{testimonial.text}&quot;
      </div>
    </li>
  );
};

const Testimonials11 = () => {
  return (
    <section className="bg-slate-50 dark:bg-[#0a0a0a]" id="testimonials">
      <div className="py-24 px-8 max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col text-center w-full space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
            212 makers are already shipping faster!
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-60 leading-relaxed text-slate-600 dark:text-slate-400">
            Don&apos;t take our word for it. Here&apos;s what they have to say about {config.appName}.
          </p>
        </div>
        <ul role="list" className="grid max-w-2xl grid-cols-1 gap-6 mx-auto sm:gap-8 md:grid-cols-2 lg:max-w-none lg:grid-cols-4">
          <li><ul role="list" className="flex flex-col gap-6 sm:gap-8">{[...Array(3)].map((e, i) => (<Testimonial key={i} i={i} />))}</ul></li>
          <li className="hidden md:grid order-none md:order-first lg:order-none col-span-2 grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <ul className="col-span-2">
              <li>
                <figure className="relative h-full p-10 bg-white dark:bg-white/[0.02] border-4 border-slate-950 dark:border-white rounded-3xl shadow-2xl text-left">
                  <blockquote className="relative mb-10">
                    <p className="text-2xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-[1.1]">
                      {list[list.length - 1].text}
                    </p>
                  </blockquote>
                  <figcaption className="relative flex items-center justify-start gap-4 pt-8 mt-8 border-t border-black/5 dark:border-white/5">
                    <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 shrink-0 border-4 border-slate-950 dark:border-white shadow-md">
                      {list[list.length - 1].img ? (
                        <Image className="w-16 h-16 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src={list[list.length - 1].img} alt={list[list.length - 1].name} width={64} height={64} />
                      ) : (
                        <span className="w-16 h-16 rounded-full flex justify-center items-center text-2xl font-black bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white">{list[list.length - 1].name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black uppercase tracking-widest text-slate-950 dark:text-white">{list[list.length - 1].name}</div>
                      {list[list.length - 1].username && (
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">@{list[list.length - 1].username}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </li>
            </ul>
            <ul role="list" className="flex flex-col gap-6 sm:gap-8">{[...Array(2)].map((e, i) => (<Testimonial key={i} i={i + 3} />))}</ul>
            <ul role="list" className="flex flex-col gap-6 sm:gap-8">{[...Array(2)].map((e, i) => (<Testimonial key={i} i={i + 5} />))}</ul>
          </li>
          <li><ul role="list" className="flex flex-col gap-6 sm:gap-8">{[...Array(3)].map((e, i) => (<Testimonial key={i} i={i + 7} />))}</ul></li>
        </ul>
      </div>
    </section>
  );
};

export default Testimonials11;