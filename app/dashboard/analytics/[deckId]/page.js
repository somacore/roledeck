"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { createClient } from "@/libs/supabase/client";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";

const HandshakeMap = dynamic(() => import('./HandshakeMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest opacity-30 italic">Initialising Map...</div>
});

export default function DeckAnalytics() {
  const { deckId } = useParams();
  const { resolvedTheme } = useTheme();
  const [deck, setDeck] = useState(null);
  const [locations, setLocations] = useState({});
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("decks").select(`*, views (id, viewer_ip, user_agent, created_at)`).eq("id", deckId).eq("user_id", user.id).single();
      if (data) {
        setDeck(data);
        const uniqueIps = [...new Set(data.views.map(v => v.viewer_ip))];
        const locMap = {};
        const markers = [];
        for (const ip of uniqueIps) {
          try {
            const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,regionName,lat,lon`);
            const json = await res.json();
            if (json.status === "success") {
              locMap[ip] = `${json.city}, ${json.regionName}`;
              markers.push({ position: [json.lat, json.lon], label: json.city });
            }
          } catch (e) { console.error(e); }
        }
        setLocations(locMap);
        setMapData(markers);
      }
      setLoading(false);
    }
    getAnalytics();
  }, [deckId]);

  if (loading) return <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 animate-pulse italic">Connecting_Telemetry...</div>;

  return (
    <div className="flex flex-col h-full -m-12">
      {/* MAP VIEW - Negative margin pulls it to the very edge of the viewport */}
      <section className="h-[45vh] w-full border-b border-black/5 dark:border-white/10 relative overflow-hidden">
        <HandshakeMap mapData={mapData} isDark={resolvedTheme === 'dark'} />
      </section>

      {/* DATA VIEW - Internal padding matches the dashboard layout */}
      <div className="p-12 space-y-12 max-w-6xl">
        <header className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight uppercase italic">
              {deck?.is_public ? "Public Profile" : deck?.company}
            </h1>
            <p className="text-[10px] opacity-40 uppercase tracking-widest font-medium">
              {deck?.slug || "Primary Page"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-primary font-bold text-4xl tracking-tighter tabular-nums italic">
              {deck?.views.length}
            </div>
            <div className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Total Views</div>
          </div>
        </header>

        {/* KEY INDICATORS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Unique Visitors</div>
            <div className="text-xl font-bold tabular-nums">{new Set(deck?.views.map(v => v.viewer_ip)).size}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Status</div>
            <div className="text-xl font-bold text-green-500 uppercase italic tracking-tight">Active</div>
          </div>
        </div>

        {/* LOGS TABLE */}
        <section className="space-y-6 pb-20">
          <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Visitor History</h2>
          <div className="border border-black/5 dark:border-white/10">
            <table className="w-full text-left text-[11px] font-medium">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase tracking-widest border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 opacity-60">Time</th>
                  <th className="px-6 py-4 opacity-60">Location</th>
                  <th className="px-6 py-4 opacity-60">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {deck?.views.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 opacity-50 font-mono tabular-nums">
                      {new Date(v.created_at).toLocaleTimeString([], { hour12: true })}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {locations[v.viewer_ip] || "Resolving..."}
                    </td>
                    <td className="px-6 py-4 opacity-30 font-mono tabular-nums">
                      {v.viewer_ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}