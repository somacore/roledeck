"use client"; // ✅ This enables interactivity

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="border-2 border-black text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
    >
      Print Page
    </button>
  );
}