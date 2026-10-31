import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../auth/UserAuthContext";
import AuthLayout from "../../layouts/AuthLayout";
import { Percent, Clock, ShieldCheck } from "lucide-react";

export default function LoginPage({ isLanding = false }) {
  const navigate = useNavigate();
  const { signIn } = useUserAuth();
  
  const [idNumber, setIdNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!idNumber.trim() || !pin) return setErr("Enter your ID number and PIN.");
    setErr("");
    // Mock authentication
    signIn({ idNumber, name: "Amina Wanjiru" });
    // This sends them to the UserLayout, which renders HomeRedirect -> ActiveLoanPage (Dashboard)
    if (!isLanding) navigate("/app", { replace: true });
  }

  const features = [
    { icon: Percent, text: "Flat interest, shown before you apply" },
    { icon: Clock, text: "30 days to repay, with automatic reminders" },
    { icon: ShieldCheck, text: "Sign your agreement right in the app" }
  ];

  const formContent = (
    <div className={`w-full flex flex-col gap-6 ${isLanding ? "p-5" : ""}`}>
      <div>
        <h1 className={`font-extrabold ${isLanding ? "text-2xl" : "text-4xl"}`}>Welcome back</h1>
        <p className="text-white/60 mt-2 text-sm">Sign in with your ID number to continue.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold block mb-2">ID number</label>
          <input
            className="w-full h-12 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition"
            inputMode="numeric"
            placeholder="e.g. 12345678"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-2">PIN</label>
          <div className="relative">
            <input
              className="w-full h-12 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition pr-16"
              type={showPin ? "text" : "password"}
              placeholder="Your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-3 text-xs font-bold text-brand-secondary hover:text-white transition"
            >
              {showPin ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-secondary rounded" />
            Remember me
          </label>
          <button type="button" className="text-brand-secondary font-semibold hover:underline" onClick={() => alert("Reset link sent (demo).")}>
            Forgot PIN?
          </button>
        </div>

        {err && <p className="text-red-400 text-sm font-semibold">{err}</p>}

        <button type="submit" className="w-full h-[52px] rounded-xl bg-brand-accent text-brand-ink font-extrabold text-base mt-2 hover:bg-yellow-400 transition">
          Sign in
        </button>
        
        <button type="button" className="w-full h-[52px] rounded-xl border border-brand-secondary text-brand-secondary font-extrabold text-base hover:bg-brand-secondary/10 transition">
          Use fingerprint
        </button>
      </form>

      <p className="text-center text-sm text-white/60 mt-2">
        New to BorrowBee? <Link to="/register" className="text-brand-secondary font-extrabold hover:underline">Create an account</Link>
      </p>
    </div>
  );

  if (isLanding) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#04120F] text-[#F0FDF4] font-sans flex flex-col">
        <div className="bg-brand-primary px-5 py-4 font-extrabold text-lg flex items-center gap-3 sticky top-0 z-10">
          <img src="/logob.png" alt="BorrowBee" className="w-8 h-8 rounded-full" />
          BorrowBee
        </div>
        {formContent}
      </div>
    );
  }

  return (
    <AuthLayout title="Quick cash. Clear terms." subtitle="Approved in 30 minutes." features={features}>
      {formContent}
    </AuthLayout>
  );
}