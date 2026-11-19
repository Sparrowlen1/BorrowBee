import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

const PRESET_REASONS = [
  "Incomplete guarantor details",
  "Signed agreement not attached",
  "ID verification failed",
  "Poor repayment history on another loan",
  "Requested amount exceeds current limit",
  "Other",
];

export default function DeclineDialog({ loan, open, onClose, onConfirm }) {
  const [reason, setReason] = useState(PRESET_REASONS[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const isOther = reason === "Other";

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm({
        reason: isOther
          ? note.trim() || "Other"
          : `${reason}${note.trim() ? ` — ${note.trim()}` : ""}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
            <h2 className="text-xl font-extrabold m-0">Decline request</h2>
            <p className="text-[#A9C4BE] text-[13px] mt-1 m-0">
              {loan?.borrowerName} · They will see the reason on their app.
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

        <div className="bg-[#FCA5A5]/10 border border-[#FCA5A5]/30 rounded-xl px-3.5 py-2.5 text-[13px] flex items-start gap-2">
          <AlertCircle size={15} className="text-[#FCA5A5] mt-0.5 shrink-0" />
          <p className="m-0 text-[#F0FDF4]/80">
            Declining is final. The borrower must submit a new request.
          </p>
        </div>

        <div>
          <label htmlFor="declineReason" className="block text-[13px] font-semibold mb-1.5">
            Reason
          </label>
          <select
            id="declineReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-12 rounded-xl border border-white/45 bg-white/5 text-white px-3.5 text-[15px]"
          >
            {PRESET_REASONS.map((r) => (
              <option key={r} value={r} className="text-black bg-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="declineNote" className="block text-[13px] font-semibold mb-1.5">
            Note to borrower{" "}
            {!isOther && <span className="text-[#A9C4BE] font-normal">(optional)</span>}
          </label>
          <textarea
            id="declineNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={
              isOther
                ? "Explain the reason (required)."
                : "Anything they should fix before reapplying."
            }
            className="w-full rounded-xl border border-white/45 bg-white/5 text-white px-3.5 py-2.5 text-[15px] resize-y"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-xl border-2 border-[#00BFA5] text-[#F0FDF4] font-bold text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || (isOther && !note.trim())}
            className="px-5 h-11 rounded-xl bg-[#FCA5A5] text-[#450A0A] font-extrabold text-sm disabled:opacity-60 inline-flex items-center gap-2"
          >
            <X size={15} />
            {submitting ? "Declining…" : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}