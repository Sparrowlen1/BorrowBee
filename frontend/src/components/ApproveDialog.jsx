import { useState } from "react";
import { X, Check } from "lucide-react";
import { NEW_USER_LIMIT } from "../utils/constants";

const LIMIT = NEW_USER_LIMIT ?? 5000;

const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

export default function ApproveDialog({ loan, open, onClose, onConfirm }) {
  const requested = Number(loan?.amount) || 0;
  const isNewUser = requested <= LIMIT;

  const [override, setOverride] = useState(false);
  const [amount, setAmount] = useState(requested);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm({ amount: override ? Number(amount) : requested });
    } finally {
      setSubmitting(false);
    }
  };

  const invalidOverride =
    override && (!amount || Number(amount) < 1000 || Number(amount) > 100000);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0B2A25] text-[#F0FDF4] border border-white/10 rounded-2xl p-6 w-full max-w-[500px] flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-xl font-extrabold m-0">Approve loan</h2>
            <p className="text-[#A9C4BE] text-[13px] mt-1 m-0">
              {loan?.borrowerName} · Requested {fmtKES(requested)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 text-[#A9C4BE] p-1 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {isNewUser ? (
          <div className="bg-[#FFB300]/10 border border-[#FFB300]/40 rounded-xl px-3.5 py-2.5 text-[13px]">
            <p className="m-0 font-bold text-[#FFB300]">New user limit</p>
            <p className="m-0 mt-1 text-[#F0FDF4]/80">
              This borrower is capped at {fmtKES(LIMIT)}. You can approve more
              if you wish — the new amount becomes their ongoing limit.
            </p>
          </div>
        ) : (
          <p className="m-0 text-[#A9C4BE] text-[13px]">
            This borrower already has a higher limit.
          </p>
        )}

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={override}
            onChange={(e) => setOverride(e.target.checked)}
            className="w-[18px] h-[18px] accent-[#00BFA5]"
          />
          Override the approved amount for this loan
        </label>

        {override && (
          <div>
            <label
              htmlFor="approvedAmount"
              className="block text-[13px] font-semibold mb-1.5"
            >
              Approved amount (KES)
            </label>
            <input
              id="approvedAmount"
              type="number"
              min={1000}
              max={100000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 rounded-xl border border-white/45 bg-white/5 text-white px-3.5 text-[15px]"
            />
            <p className="text-[#A9C4BE] text-xs mt-1.5">
              Interest (15%) recalculates automatically on the new amount.
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-xl border-2 border-[#00BFA5] text-[#F0FDF4] font-bold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || invalidOverride}
            className="px-5 h-11 rounded-xl bg-[#FFB300] text-[#0F172A] font-extrabold text-sm disabled:opacity-60 inline-flex items-center gap-2"
          >
            <Check size={15} />
            {submitting ? "Approving…" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}