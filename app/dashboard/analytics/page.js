export default function AnalyticsIndex() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-20 text-center bg-white">
      <div className="w-24 h-24 mb-6 opacity-10">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      </div>
      <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Telemetry Standby</h2>
      <p className="text-sm opacity-50 max-w-sm">
        Please select one of your active trackers from the left sidebar to view visitor data, IP addresses, and device distribution.
      </p>
    </div>
  );
}