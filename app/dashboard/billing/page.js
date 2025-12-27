"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import config from "@/config";
import apiClient from "@/libs/api";

export default function BillingPage() {
  const [profile, setProfile] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("has_access, price_id")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  const handleCheckout = async (variantId) => {
    try {
      const res = await apiClient.post("/lemonsqueezy/create-checkout", { variantId });
      if (res.url) window.location.href = res.url;
    } catch (e) {
      console.error("Checkout error", e);
    }
  };

  if (loading) return <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Loading_System...</div>;

  // Logic to find current plan name based on config
  const currentPlan = config.lemonsqueezy.plans.find(p => 
    p.variantId === profile?.price_id || p.variantIdMonthly === profile?.price_id || p.variantIdYearly === profile?.price_id
  );

  return (
    <div className="max-w-5xl space-y-16">
      {/* 1. CURRENT STATUS HEADER */}
      <section className="bg-slate-50 dark:bg-white/[0.02] p-10 rounded-2xl">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Subscription Status</h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
              {profile?.has_access ? (currentPlan?.name || "Active Plan") : "Free Tier"}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-1">
              {profile?.has_access ? "Full Access Enabled" : "Limited Access"}
            </p>
          </div>
          {profile?.has_access && (
            <div className="px-4 py-2 bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full">
              Active
            </div>
          )}
        </div>
      </section>

      {/* 2. PLAN SELECTION & TOGGLE */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a855f7]">Available Upgrades</h3>
            <p className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Choose your deployment scale</p>
          </div>

          {/* CYCLE TOGGLE */}
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
            {["monthly", "yearly"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                  billingCycle === cycle 
                    ? "bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cycle}
                {cycle === "yearly" && <span className="ml-2 text-[8px] text-primary">-20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.lemonsqueezy.plans.map((plan) => {
            const isCurrent = plan.variantId === profile?.price_id;
            
            return (
              <div key={plan.name} className="bg-slate-50 dark:bg-white/[0.02] p-10 flex flex-col justify-between group hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">{plan.name}</h4>
                    <div className="text-right">
                      <span className="text-3xl font-black tracking-tighter tabular-nums">${billingCycle === 'monthly' ? plan.price : Math.floor(plan.price * 10)}</span>
                      <span className="text-[9px] font-bold uppercase opacity-30 block">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 leading-relaxed">{plan.description}</p>
                  
                  <ul className="space-y-3 pt-4">
                    {plan.features.map(f => (
                      <li key={f.name} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white/60">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {f.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  disabled={isCurrent}
                  onClick={() => handleCheckout(plan.variantId)}
                  className={`mt-10 w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
                    isCurrent 
                      ? "bg-transparent border-2 border-slate-200 text-slate-300 cursor-not-allowed" 
                      : "bg-slate-950 dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white"
                  }`}
                >
                  {isCurrent ? "Current Plan" : "Upgrade Access"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}