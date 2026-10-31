import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { toast } from "sonner";
import { K, STATUS } from "../../utils/constants";

export default function WaitingPage() {
  const navigate = useNavigate();
  const { loan } = useLoan();
  const [seconds, setSeconds] = useState(1800);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (loan?.status === STATUS.APPROVED) navigate("/app/payout", { replace: true });
    if (loan?.status === STATUS.DECLINED) navigate("/app/apply", { replace: true });
  }, [loan?.status, navigate]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="bg-brand-primary text-white px-5 py-4 font-extrabold text-lg">Under review</div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="text-4xl font-extrabold text-white">{mm}:{ss}</div>
          <div className="text-xs text-white/60">about 30 minutes</div>
        </div>
        <p className="text-sm text-white/70 text-center">
          We received your signed form. You will get a notification as soon as a decision is made.
        </p>
        <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-4">
          <div className="text-sm font-bold">Request: {loan ? K(loan.amount) : "—"}</div>
          <div className="text-sm text-white/70">Total to repay: {loan ? K(loan.total) : "—"}</div>
        </div>
        <button onClick={() => toast.info("Still under review. We will notify you.")} className="h-12 rounded-xl border-2 border-brand-secondary text-brand-secondary font-extrabold">
          Check status
        </button>
        <button onClick={() => navigate("/admin")} className="h-12 rounded-xl border-2 border-brand-secondary text-brand-secondary font-extrabold">
          Demo: go to lender dashboard
        </button>
      </div>
    </div>
  );
}
