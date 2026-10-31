import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { toast } from "sonner";
import { K } from "../../utils/constants";

export default function PayoutPage() {
  const navigate = useNavigate();
  const { loan, disburse } = useLoan();
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [err, setErr] = useState("");

  if (!loan) return null;

  async function confirm() {
    const a = n1.replace(/\s/g, "");
    const b = n2.replace(/\s/g, "");
    if (a.length < 10) return setErr("Enter a valid 10-digit number.");
    if (a !== b) return setErr("The numbers do not match.");
    setErr("");
    await disburse(n1);
    toast.success(`${K(loan.amount)} sent to ${n1}.`);
    navigate("/app/loan");
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="bg-brand-primary text-white px-5 py-4 font-extrabold text-lg">Approved</div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="bg-brand-primary rounded-2xl p-5 text-white">
          <div className="text-[40px] font-extrabold leading-none">{K(loan.amount)}</div>
          <p className="text-sm text-white/70 mt-1">Your loan is ready. Choose where to receive it.</p>
        </div>
        <input className="h-12 rounded-xl px-3 bg-white text-brand-ink" inputMode="tel" placeholder="07XX XXX XXX" value={n1} onChange={(e) => setN1(e.target.value)} />
        <input className="h-12 rounded-xl px-3 bg-white text-brand-ink" inputMode="tel" placeholder="Confirm number" value={n2} onChange={(e) => setN2(e.target.value)} />
        {err && <p className="text-red-300 text-sm font-semibold">{err}</p>}
        <button onClick={confirm} className="mt-auto h-[52px] rounded-[14px] bg-brand-accent text-brand-ink font-extrabold">
          Confirm and receive money
        </button>
      </div>
    </div>
  );
}
