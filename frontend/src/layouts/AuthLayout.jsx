import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children, title, subtitle, features }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-[#04120F] text-[#F0FDF4] font-sans">
      
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#004D40]">
        {/* Radial gradient overlay to create the light-to-dark green effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,191,165,0.6),transparent_70%)] pointer-events-none"></div>
        
        {/* Giant Bee Watermark */}
        <img 
          src="/logob.png" 
          alt="" 
          className="absolute right-[-100px] bottom-[-150px] w-[700px] h-[700px] opacity-10 pointer-events-none mix-blend-overlay" 
        />

        <div className="relative z-10 flex items-center gap-3 text-2xl font-extrabold">
          <img src="/logob.png" alt="BorrowBee" className="w-10 h-10 rounded-full" />
          BorrowBee
        </div>
        
        <div className="relative z-10 max-w-[520px]">
          <h1 className="text-[clamp(34px,4.4vw,56px)] font-extrabold leading-[1.05] tracking-tight">
            {title} <br />
            <span className="text-brand-accent">{subtitle}</span>
          </h1>
        </div>

        <div className="relative z-10 flex flex-col gap-5 text-sm font-medium">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const isComponent = typeof Icon !== "string";
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-none w-8 h-9 bg-brand-accent text-brand-ink flex items-center justify-center font-extrabold text-xs" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}>
                  {isComponent ? <Icon size={14} strokeWidth={3} /> : Icon}
                </div>
                {feat.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        
        {/* Back to Home Button (Top Right) */}
        <Link 
          to="/" 
          className="absolute top-6 right-6 flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="w-full max-w-[430px] flex flex-col">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 text-2xl font-extrabold mb-8">
            <img src="/logob.png" alt="BorrowBee" className="w-8 h-8 rounded-full" />
            BorrowBee
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}