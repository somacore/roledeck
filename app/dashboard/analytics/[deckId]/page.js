"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { createClient } from "@/libs/supabase/client";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";

const HandshakeMap = dynamic(() => import('./HandshakeMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest opacity-30">Initialising Map...</div>
});

export default function DeckAnalytics() {
  const { deckId } = useParams();
  const { resolvedTheme } = useTheme();
  const [deck, setDeck] = useState(null);
  const [locations, setLocations] = useState({});
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
  }, [deckId, supabase]);

  if (loading) return <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 animate-pulse text-left">Connecting_Telemetry...</div>;

  // Pagination Logic
  const totalViews = deck?.views?.length || 0;
  const totalPages = Math.ceil(totalViews / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedViews = deck?.views?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="space-y-12">
      {/* 1. HEADER: Bold, high-contrast, borderless */}
      <header className="flex justify-between items-end pb-10">
        <div className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a855f7]">Live Data</h2>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-slate-950 dark:text-white">
            {deck?.is_public ? "Public Profile" : deck?.company}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            Target: {deck?.slug || "General"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black tracking-tighter tabular-nums leading-none text-slate-950 dark:text-white">
            {totalViews}
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">Total Views</div>
        </div>
      </header>

      {/* 2. MAP: Borderless geometric container with shading */}
      <section className="h-[400px] w-full overflow-hidden bg-slate-50 dark:bg-white/[0.02] shadow-sm">
        <HandshakeMap mapData={mapData} isDark={resolvedTheme === 'dark'} />
      </section>

      {/* 3. GRID INDICATORS: High contrast blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-50 dark:bg-white/[0.02] p-8">
          <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4">Unique Visitors</h4>
          <p className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white">
            {new Set(deck?.views.map(v => v.viewer_ip)).size}
          </p>
        </div>
        
        <div className="bg-slate-50 dark:bg-white/[0.02] p-8">
          <h4 className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4">Link Status</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-xl font-black uppercase tracking-tight text-green-600">Active</p>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY LOGS: Shaded list entries */}
      <section className="space-y-6 pb-20">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Logs</h3>
        <div className="space-y-1">
          {paginatedViews.map((v) => (
            <div key={v.id} className="p-6 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-all group">
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-mono opacity-30 tabular-nums">
                  {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-white/80 group-hover:text-[#a855f7] transition-colors">
                  {locations[v.viewer_ip] || "Resolving Geolocation..."}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-20 group-hover:opacity-40">{v.viewer_ip}</span>
            </div>
          ))}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-30">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest hover:bg-[#a855f7] hover:text-white dark:hover:bg-[#a855f7] dark:hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {totalViews === 0 && (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest opacity-20 bg-slate-50 dark:bg-white/[0.01]">
              No activity detected yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}