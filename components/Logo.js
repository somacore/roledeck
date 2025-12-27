import Image from "next/image";

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Visual Asset: Your logo.png */}
      <Image 
        src="/logo.png" 
        alt="RoleDeck Logo" 
        width={32} 
        height={32} 
        className="shrink-0"
        priority
      />
      
      {/* Brand Text */}
      <span className="text-sm font-black tracking-[0.2em] uppercase leading-none text-slate-950 dark:text-white">
        RoleDeck
      </span>
    </div>
  );
};

export default Logo;