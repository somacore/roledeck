export default function AnalyticsIndex() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Sharp geometric element instead of slanted pulse */}
      <div className="w-16 h-16 mb-8 opacity-5 border-4 border-slate-900 dark:border-white rotate-45" />
      
      <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-4 text-slate-400">
        Telemetry Standby
      </h2>
      
      <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 max-w-xs leading-relaxed">
        Select an active tracker from the sidebar to view visitor data, geolocation, and engagement signals.
      </p>
    </div>
  );
}