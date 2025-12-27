"use client";

const ButtonGradient = ({ title = "Gradient Button", onClick = () => {} }) => {
  return (
    <button 
      className="inline-flex items-center justify-center px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg border border-transparent outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer btn-gradient animate-shimmer" 
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ButtonGradient;