import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  return (
    <section className="bg-slate-50 dark:bg-[#080808] overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Pricing</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 dark:text-white uppercase leading-none">
            Save hours of repetitive code and ship faster!
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {config.stripe.plans.map((plan) => (
            <div key={plan.priceId} className="relative w-full max-w-lg">
              {plan.isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    POPULAR
                  </span>
                </div>
              )}

              {plan.isFeatured && (
                <div
                  className="absolute -inset-[2px] rounded-[24px] bg-primary opacity-10 z-0"
                ></div>
              )}

              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-white dark:bg-white/[0.02] p-10 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm transition-all hover:shadow-xl">
                <div className="flex justify-between items-center gap-4 text-left">
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tighter text-slate-950 dark:text-white leading-none">{plan.name}</p>
                    {plan.description && (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2 leading-relaxed">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  {plan.priceAnchor && (
                    <div className="flex flex-col justify-end mb-[6px] text-lg ">
                      <p className="relative">
                        <span className="absolute bg-slate-300 dark:bg-slate-700 h-[2px] inset-x-0 top-[53%] transform -rotate-6"></span>
                        <span className="text-slate-300 dark:text-slate-600 font-bold">
                          ${plan.priceAnchor}
                        </span>
                      </p>
                    </div>
                  )}
                  <p className="text-6xl tracking-tighter font-black text-slate-950 dark:text-white tabular-nums">
                    ${plan.price}
                  </p>
                  <div className="flex flex-col justify-end mb-[6px]">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      USD
                    </p>
                  </div>
                </div>
                {plan.features && (
                  <ul className="space-y-4 text-sm flex-1 pt-6 text-left border-t border-black/5 dark:border-white/5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-primary shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/60">{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-4 pt-6">
                  <ButtonCheckout priceId={plan.priceId} />

                  <p className="flex items-center justify-center gap-2 text-[9px] text-center text-slate-400 font-black uppercase tracking-widest">
                    Pay once. Access forever.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;