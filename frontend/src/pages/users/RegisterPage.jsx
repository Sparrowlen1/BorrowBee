import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../auth/UserAuthContext";
import AuthLayout from "../../layouts/AuthLayout";
import { toast } from "sonner";

export default function RegisterPage({ isLanding = false }) {
  const navigate = useNavigate();
  const { signIn } = useUserAuth();
  
  const [form, setForm] = useState({ name: "", id: "", phone: "", pin: "", confirmPin: "" });
  const [showPin, setShowPin] = useState(false);
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.id || !form.phone) return setErr("Fill in your name, ID number and mobile number.");
    if (form.pin.length < 4) return setErr("Your PIN needs at least 4 digits.");
    if (form.pin !== form.confirmPin) return setErr("The PINs do not match.");
    
    setErr("");
    // Mock registration
    signIn({ idNumber: form.id, name: form.name, phone: form.phone });
    toast.success("Account created successfully!");
    // This sends them to the UserLayout, which renders HomeRedirect -> ActiveLoanPage (Dashboard)
    if (!isLanding) navigate("/app", { replace: true });
  }

  const features = [
    { icon: "1", text: "Create your account" },
    { icon: "2", text: "Choose an amount and sign the agreement" },
    { icon: "3", text: "Get approved and paid to your phone" }
  ];

  const formContent = (
    <div className={`w-full flex flex-col gap-5 ${isLanding ? "p-5" : ""}`}>
      <div>
        <h1 className={`font-extrabold ${isLanding ? "text-2xl" : "text-4xl"}`}>Create account</h1>
        <p className="text-white/60 mt-2 text-sm">Step 1 of 2: your details</p>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className="h-1.5 flex-1 rounded-full bg-brand-secondary"></div>
          <div className="h-1.5 flex-1 rounded-full bg-white/10"></div>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1.5">Full name</label>
          <input
            className="w-full h-11 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition"
            placeholder="As on your ID"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">ID number</label>
          <input
            className="w-full h-11 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition"
            inputMode="numeric"
            placeholder="e.g. 12345678"
            value={form.id}
            onChange={(e) => setForm({...form, id: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">Mobile number</label>
          <input
            className="w-full h-11 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition"
            inputMode="tel"
            placeholder="07XX XXX XXX"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1.5">Create a PIN</label>
          <div className="relative">
            <input
              className="w-full h-11 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition pr-16"
              type={showPin ? "text" : "password"}
              placeholder="At least 4 digits"
              value={form.pin}
              onChange={(e) => setForm({...form, pin: e.target.value})}
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

        <div>
          <label className="text-xs font-semibold block mb-1.5">Confirm PIN</label>
          <input
            className="w-full h-11 rounded-xl border border-white/20 bg-[#0A1A17] px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-accent transition"
            type="password"
            placeholder="Repeat your PIN"
            value={form.confirmPin}
            onChange={(e) => setForm({...form, confirmPin: e.target.value})}
          />
        </div>

        <label className="flex items-start gap-2 text-xs font-semibold cursor-pointer mt-2">
          <input type="checkbox" required className="w-4 h-4 accent-brand-secondary mt-0.5" />
          I agree to the terms and the 15% flat interest
        </label>

        {err && <p className="text-red-400 text-sm font-semibold mt-1">{err}</p>}

        <button type="submit" className="w-full h-[52px] rounded-xl bg-brand-accent text-brand-ink font-extrabold text-base mt-2 hover:bg-yellow-400 transition">
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-white/60">
        Already registered? <Link to="/login" className="text-brand-secondary font-extrabold hover:underline">Sign in</Link>
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
    <AuthLayout title="Join in" subtitle="two minutes." features={features}>
      {formContent}
    </AuthLayout>
  );
}