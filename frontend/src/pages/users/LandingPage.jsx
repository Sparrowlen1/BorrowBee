import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useUserAuth } from "../../auth/UserAuthContext";
import { K } from "../../utils/constants";
import PhoneShell from "../../components/PhoneShell";
import RegisterPage from "./RegisterPage"; 
import { 
  Clock, 
  Percent, 
  ShieldCheck, 
  RefreshCw, 
  UserPlus, 
  FileSignature, 
  CheckCircle2, 
  Banknote,
  TrendingUp,
  Zap,
  Smartphone,
  Award,
  PlayCircle
} from "lucide-react";

export default function LandingPage() {
  const { borrower } = useUserAuth();
  const [amount, setAmount] = useState(5000);

  // If the user is already signed in, skip the landing page and send them to their dashboard
  if (borrower) {
    return <Navigate to="/app" replace />; 
  }

  const features = [
    { icon: Clock, label: "Fast approval", desc: "Your request reaches the lender instantly." },
    { icon: Percent, label: "Flat interest", desc: "See your total before you apply." },
    { icon: ShieldCheck, label: "Guarantor-backed", desc: "Sign and upload right in the app." },
    { icon: RefreshCw, label: "Live updates", desc: "Status and reminders update automatically." }
  ];

  const steps = [
    { icon: UserPlus, title: "1. Sign Up", desc: "Enter your name, ID number and phone number to create a secure account." },
    { icon: FileSignature, title: "2. Apply & Sign", desc: "Choose your amount, download the agreement, and add your guarantor's details." },
    { icon: CheckCircle2, title: "3. 30-Min Review", desc: "Your lender reviews the request. You get a notification the moment it's approved." },
    { icon: Banknote, title: "4. Get Paid", desc: "Confirm your M-Pesa number and receive the cash directly to your phone." }
  ];

  const futureFeatures = [
    { icon: TrendingUp, title: "Higher Limits", desc: "Build your credit score and unlock limits up to KES 50,000." },
    { icon: Zap, title: "Instant Payouts", desc: "Direct M-Pesa STK Push integration for zero-second disbursements." },
    { icon: Smartphone, title: "Flexible Repayment", desc: "Pay back in convenient 3, 6, or 12-month installments." },
    { icon: Award, title: "Credit Building", desc: "We report your positive repayment history to CRB to help you build a better financial future." }
  ];

  return (
    <div className="min-h-screen bg-[#04120F] text-white overflow-hidden relative font-sans flex flex-col">
      {/* Background Glows */}
      <div className="absolute right-[-80px] top-[-60px] w-[680px] h-[680px] bg-[radial-gradient(circle_at_40%_40%,rgba(0,191,165,0.45),transparent_60%),radial-gradient(circle_at_70%_65%,rgba(255,179,0,0.22),transparent_55%)] blur-[30px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap justify-between items-center px-8 py-5 max-w-[1180px] mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold hover:opacity-80 transition">
          <img src="/logob.png" alt="BorrowBee" className="w-9 h-9 rounded-full" />
          BorrowBee
        </Link>
        <nav className="hidden md:flex gap-1 bg-white/5 p-1.5 rounded-xl text-sm font-semibold">
          <a href="#home" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Home</a>
          <a href="#features" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Features</a>
          <a href="#how-it-works" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">How it works</a>
          <a href="#future" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Roadmap</a>
          <Link to="/register" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Try the app</Link>
        </nav>
        <Link to="/register" className="bg-brand-accent text-brand-ink px-5 py-2.5 rounded-xl font-extrabold text-sm hover:scale-105 transition">
          Get started
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-[1180px] mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start w-full">
        
        {/* Left Side: Marketing & Slider */}
        <div className="flex flex-col gap-6" id="home">
          <div>
            <span className="inline-block bg-brand-accent text-brand-ink text-xs font-extrabold px-3 py-1.5 rounded-full">
              Loans up to KES 5,000 · 15% flat · 30 days
            </span>
          </div>
          
          <h1 className="text-[clamp(38px,5vw,66px)] leading-[1.04] font-semibold tracking-tight">
            Quick cash. Clear terms. <br />
            <span className="text-brand-accent">Approved in 30 minutes.</span>
          </h1>
          
          <p className="text-[#B7CFC9] max-w-[520px] text-base leading-relaxed">
            Sign up with your ID, sign the agreement and get paid to your phone. No hidden fees, and every update arrives automatically.
          </p>

          {/* Features Grid */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4" id="features">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-none w-10 h-11 bg-brand-accent text-brand-ink flex items-center justify-center font-extrabold text-sm" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <b className="block text-sm">{feat.label}</b>
                    <p className="text-[#B7CFC9] text-xs mt-1 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Amount Slider Card */}
          <div className="bg-white text-brand-ink rounded-3xl p-6 flex flex-col gap-3 mt-2">
            <label className="font-bold text-sm">Select loan amount</label>
            <div className="text-[44px] font-extrabold leading-none text-brand-primary">
              {K(amount)}
            </div>
            <input 
              type="range" min="500" max="5000" step="500" value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-brand-secondary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>KES 500</span>
              <span>KES 5,000</span>
            </div>
            <Link to="/register" className="bg-brand-accent text-brand-ink text-center font-extrabold py-3.5 rounded-xl mt-2 hover:bg-yellow-400 transition">
              Get started
            </Link>
          </div>
        </div>

        {/* Right Side: Phone Mockup embedding the Register Page */}
        <div id="app" className="flex flex-col items-center lg:items-end w-full">
          <div className="w-full max-w-[390px]">
             <PhoneShell>
               {/* isLanding={true} ensures it fits perfectly inside the phone layout */}
               <RegisterPage isLanding={true} />
             </PhoneShell>
             <div className="text-center text-xs text-[#9FE8D8] font-semibold mt-4 flex items-center justify-center gap-2">
               <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
               Live interactive prototype
             </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-[1180px] mx-auto px-8 py-20 w-full border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">How BorrowBee Works</h2>
          <p className="text-[#B7CFC9] mt-3 max-w-[600px] mx-auto">
            Four simple steps between you and the cash you need. No paperwork, no branch visits, and absolutely no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-[#B7CFC9] mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Future / Roadmap Section with Live Video */}
      <section id="future" className="relative z-10 max-w-[1180px] mx-auto px-8 py-20 w-full border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">The Future of BorrowBee</h2>
          <p className="text-[#B7CFC9] mt-3 max-w-[600px] mx-auto">
            We are constantly building. Watch this space as we roll out new features to make borrowing even faster and more flexible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Live Video Preview */}
          <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,191,165,0.15)] group bg-brand-primary/20 aspect-video">
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Preview</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <PlayCircle size={64} className="text-white/80" />
            </div>

            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-blank-screen-43122-large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#04120F]/90 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <p className="text-sm font-bold text-white">BorrowBee v2.0 is coming soon</p>
            </div>
          </div>

          {/* Right Column: Roadmap Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {futureFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-[#07241F] border border-brand-secondary/20 rounded-2xl p-5 flex flex-col gap-3 hover:border-brand-secondary/60 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{feat.title}</h4>
                    <p className="text-xs text-[#B7CFC9] mt-1.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#020a08] mt-auto">
        <div className="max-w-[1180px] mx-auto px-8 py-12 flex flex-col md:flex-row justify-between gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-3">
              <img src="/logob.png" alt="BorrowBee" className="w-10 h-10 rounded-full" />
              <span className="text-xl font-extrabold text-white">BorrowBee</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mt-2">
              Empowering Kenyans with quick, transparent, and digital micro-loans. No hidden fees, no paperwork.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-2">Product</span>
              <a href="#features" className="text-sm text-white/50 hover:text-brand-secondary transition">Features</a>
              <a href="#how-it-works" className="text-sm text-white/50 hover:text-brand-secondary transition">How it Works</a>
              <Link to="/register" className="text-sm text-white/50 hover:text-brand-secondary transition">Try the App</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white mb-2">Company</span>
              <Link to="/about" className="text-sm text-white/50 hover:text-brand-secondary transition">About Us</Link>
              <Link to="/privacy" className="text-sm text-white/50 hover:text-brand-secondary transition">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-white/50 hover:text-brand-secondary transition">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6">
          <div className="max-w-[1180px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} BorrowBee Technologies Ltd. All rights reserved.
            </span>
            <div className="flex gap-4 text-xs text-white/40">
              <span>Made in Kenya 🇰🇪</span>
              <span>·</span>
              <Link to="/app/help" className="hover:text-white transition">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}