import Image from "next/image";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-screen">
      <Image
        src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
        alt="Background"
        className="object-cover w-full h-full"
        fill
      />
      <div className="absolute inset-0 bg-neutral-950/70"></div>
      <div className="relative z-10 text-center text-white p-8 max-w-4xl">
        <div className="flex flex-col items-center max-w-xl mx-auto p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12 text-white">
            Boost your app, launch, earn
          </h2>
          <p className="text-lg opacity-80 mb-12 md:mb-16 text-white">
            Don&apos;t waste time integrating APIs or designing a pricing
            section...
          </p>

          <button className="inline-flex items-center justify-center w-64 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-lg bg-primary text-white hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20">
            Get {config.appName}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;