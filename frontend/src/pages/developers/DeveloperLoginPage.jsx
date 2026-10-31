import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeveloperAuth } from "../../auth/DeveloperAuthContext";
import { PASSCODE } from "../../utils/constants";

export default function DeveloperLoginPage() {
  const navigate = useNavigate();
  const { login } = useDeveloperAuth();
  const [pw, setPw] = useState("");
  const [fails, setFails] = useState(0);
  const [err, setErr] = useState("");

  function submit() {
    if (fails >= 3) return setErr("Too many attempts. Reload the page.");
    if (login(pw)) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      setFails(fails + 1);
      setErr(`Wrong passcode. ${2 - fails} attempts left.`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-[380px] w-full bg-white/[0.07] border border-white/15 rounded-2xl p-6">
        <h2 className="text-xl font-extrabold text-brand-secondary">Lender sign in</h2>
        <p className="text-sm text-white/60 mt-1 mb-4">Private area. Enter your passcode.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full h-12 rounded-xl px-3 bg-white text-brand-ink mb-2"
          placeholder="Passcode"
        />
        {err && <p className="text-red-300 text-sm font-semibold">{err}</p>}
        <button onClick={submit} className="w-full h-[52px] rounded-[14px] bg-brand-accent text-brand-ink font-extrabold mt-2">
          Unlock
        </button>
        <p className="text-xs text-white/40 mt-3">Demo passcode: {PASSCODE}</p>
      </div>
    </div>
  );
}
