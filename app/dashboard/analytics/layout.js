export default function AnalyticsLayout({ children }) {
  // Navigation is handled by the root dashboard sidebar
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}