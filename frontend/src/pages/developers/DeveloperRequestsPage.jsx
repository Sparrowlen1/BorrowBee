// src/pages/developers/DeveloperRequestsPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Check,
  X as XIcon,
  FileText,
  Phone,
  AlertCircle,
  ShieldCheck,
  User,
  CreditCard,
} from "lucide-react";
import { loanApi } from "../../api/loanApi";
import { useToast } from "../../context/ToastContext";
import { STATUS, NEW_USER_LIMIT } from "../../utils/constants";
import SignedPdfViewer from "../../components/SignedPdfViewer";
import ApproveDialog from "../../components/ApproveDialog";
import DeclineDialog from "../../components/DeclineDialog";

const S = {
  PENDING:   STATUS?.PENDING   ?? "PENDING",
  APPROVED:  STATUS?.APPROVED  ?? "APPROVED",
  DECLINED:  STATUS?.DECLINED  ?? "DECLINED",
  DISBURSED: STATUS?.DISBURSED ?? "DISBURSED",
  REPAID:    STATUS?.REPAID    ?? "REPAID",
};

const APPROVAL_WINDOW = 30 * 60 * 1000; // 30 minutes
const LIMIT = NEW_USER_LIMIT ?? 5000;

const FILTERS = [
  { key: "all",       label: "All" },
  { key: S.PENDING,   label: "Pending" },
  { key: S.APPROVED,  label: "Approved" },
  { key: S.DISBURSED, label: "Disbursed" },
  { key: S.DECLINED,  label: "Declined" },
];

const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

function remainingMs(createdAt) {
  if (!createdAt) return 0;
  return Math.max(
    0,
    APPROVAL_WINDOW - (Date.now() - new Date(createdAt).getTime())
  );
}

function formatCountdown(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function statusStyle(status) {
  switch (status) {
    case S.PENDING:   return "bg-[#FFB300] text-[#0F172A]";
    case S.APPROVED:  return "bg-[rgba(0,191,165,0.2)] text-[#7FF0DC]";
    case S.DISBURSED: return "bg-[rgba(0,191,165,0.35)] text-[#042F2A]";
    case S.DECLINED:  return "bg-[#FCA5A5] text-[#450A0A]";
    case S.REPAID:    return "bg-[rgba(0,191,165,0.5)] text-[#042F2A]";
    default:          return "bg-white/10 text-[#A9C4BE]";
  }
}

export default function DeveloperRequestsPage() {
  const toast = useToast();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [phone, setPhone] = useState("");

  // 1-second tick so countdown labels stay live
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function refresh() {
    try {
      const data = await loanApi.listLoans();
      setLoans(data);
      
      // FIX: Use functional state update so it doesn't capture stale "selectedId"
      setSelectedId((currentId) => {
        // If a loan is already selected, keep it selected
        if (currentId) return currentId;
        // Otherwise, select the first pending loan, or the first loan in the list
        if (data.length > 0) {
          const firstPending = data.find((l) => l.status === S.PENDING);
          return firstPending?.id ?? data[0].id;
        }
        return null;
      });
    } catch (e) {
      toast(e?.message || "Could not load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const sorted = [...loans].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
    return filter === "all"
      ? sorted
      : sorted.filter((l) => l.status === filter);
  }, [loans, filter]);

  const selected = loans.find((l) => l.id === selectedId) || null;

  // Pre-fill payout phone when an approved loan opens
  useEffect(() => {
    if (selected?.status === S.APPROVED) {
      setPhone(selected.phone || selected.payoutPhone || "");
    } else {
      setPhone("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selected?.status]);

  async function handleApprove({ amount }) {
    if (!selected) return;
    try {
      await loanApi.approve(selected.id, { amount });
      toast(`Approved ${fmtKES(amount)} for ${selected.borrowerName}.`);
      setApproveOpen(false);
      await refresh();
    } catch (e) {
      toast(e?.message || "Could not approve");
    }
  }

  async function handleDecline({ reason }) {
    if (!selected) return;
    try {
      await loanApi.decline(selected.id, { reason });
      toast("Request declined.");
      setDeclineOpen(false);
      await refresh();
    } catch (e) {
      toast(e?.message || "Could not decline");
    }
  }

  async function handleDisburse() {
    if (!selected) return;
    const clean = phone.replace(/\D/g, "");
    if (!/^(07|01)\d{8}$/.test(clean)) {
      toast("Enter a valid 10-digit M-Pesa number, e.g. 0712345678");
      return;
    }
    try {
      await loanApi.disburse(selected.id, clean);
      toast(`Disbursed to ${clean}. 30-day repayment starts now.`);
      setPhone("");
      await refresh();
    } catch (e) {
      toast(e?.message || "Could not disburse");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold m-0">Loan requests</h2>
        <p className="text-[#A9C4BE] text-[13px] leading-relaxed mt-1 m-0">
          Review signed agreements, approve within the 30-minute window, then
          disburse to the borrower's M-Pesa number.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-white/5 rounded-2xl p-1.5 flex-wrap">
        {FILTERS.map((f) => {
          const count =
            f.key === "all"
              ? loans.length
              : loans.filter((l) => l.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`flex-1 min-w-fit px-3 h-11 rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2 ${
                filter === f.key
                  ? "bg-[#00BFA5] text-[#0F172A]"
                  : "text-[#A9C4BE] hover:text-white"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    filter === f.key
                      ? "bg-[#0F172A]/20 text-[#0F172A]"
                      : "bg-[#FFB300] text-[#0F172A]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4 min-h-[500px]">
        {/* Left: list */}
        <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
          {loading && <p className="text-[#A9C4BE] text-sm p-4">Loading…</p>}

          {!loading && filtered.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-[#A9C4BE] text-sm m-0">
                No requests match this filter.
              </p>
            </div>
          )}

          {filtered.map((l) => (
            <RequestCard
              key={l.id}
              loan={l}
              selected={l.id === selectedId}
              onClick={() => setSelectedId(l.id)}
            />
          ))}
        </div>

        {/* Right: detail */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 min-w-0">
          {!selected ? (
            <div className="grid place-items-center py-12 text-center">
              <div>
                <FileText size={36} className="text-[#A9C4BE] mx-auto" />
                <p className="text-[#A9C4BE] text-sm mt-3 m-0">
                  Select a request to review it.
                </p>
              </div>
            </div>
          ) : (
            <RequestDetail
              loan={selected}
              onApprove={() => setApproveOpen(true)}
              onDecline={() => setDeclineOpen(true)}
              onDisburse={handleDisburse}
              phone={phone}
              setPhone={setPhone}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      {selected && (
        <>
          <ApproveDialog
            loan={selected}
            open={approveOpen}
            onClose={() => setApproveOpen(false)}
            onConfirm={handleApprove}
          />
          <DeclineDialog
            loan={selected}
            open={declineOpen}
            onClose={() => setDeclineOpen(false)}
            onConfirm={handleDecline}
          />
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function RequestCard({ loan, selected, onClick }) {
  const pending = loan.status === S.PENDING;
  const ms = pending ? remainingMs(loan.createdAt) : 0;
  const expired = pending && ms === 0;
  const urgent = pending && ms > 0 && ms < 5 * 60 * 1000;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left w-full rounded-2xl border p-3.5 flex flex-col gap-2 transition-colors ${
        selected
          ? "border-[#00BFA5] bg-[rgba(0,191,165,0.12)]"
          : "border-white/10 bg-white/5 hover:border-[#00BFA5]"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="m-0 font-bold text-[15px] truncate">
            {loan.borrowerName || "Borrower"}
          </p>
          <p className="m-0 text-[#A9C4BE] text-xs">
            ID {loan.idNumber || "—"}
          </p>
        </div>
        <span
          className={`shrink-0 text-[11px] font-extrabold px-2 py-0.5 rounded-full ${statusStyle(
            loan.status
          )}`}
        >
          {loan.status}
        </span>
      </div>

      <div className="flex justify-between items-center gap-2">
        <b className="text-sm">{fmtKES(loan.amount)}</b>
        {pending && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-extrabold ${
              expired
                ? "text-[#FCA5A5]"
                : urgent
                ? "text-[#FFB300]"
                : "text-[#7FF0DC]"
            }`}
          >
            <Clock size={12} />
            {expired ? "Expired" : formatCountdown(ms)}
          </span>
        )}
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------- */

function RequestDetail({ loan, onApprove, onDecline, onDisburse, phone, setPhone }) {
  const pending = loan.status === S.PENDING;
  const approved = loan.status === S.APPROVED;
  const disbursed = loan.status === S.DISBURSED;
  const declined = loan.status === S.DECLINED;
  const repaid = loan.status === S.REPAID;

  const ms = pending ? remainingMs(loan.createdAt) : 0;
  const expired = pending && ms === 0;
  const urgent = pending && ms > 0 && ms < 5 * 60 * 1000;

  const isNewUser = Number(loan.amount) <= LIMIT;
  const amountOverridden =
    loan.approvedAmount && Number(loan.approvedAmount) !== Number(loan.amount);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-xl font-extrabold m-0">
              {loan.borrowerName || "Borrower"}
            </h3>
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${statusStyle(
                loan.status
              )}`}
            >
              {loan.status}
            </span>
            {isNewUser && (
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-[#A9C4BE]">
                New user
              </span>
            )}
          </div>
          <p className="text-[#A9C4BE] text-xs m-0">Loan ID {loan.id}</p>
        </div>

        {pending && (
          <div
            className={`inline-flex items-center gap-1.5 text-sm font-extrabold px-3 py-1.5 rounded-full ${
              expired
                ? "bg-[#FCA5A5]/20 text-[#FCA5A5]"
                : urgent
                ? "bg-[#FFB300]/20 text-[#FFB300]"
                : "bg-[#00BFA5]/20 text-[#7FF0DC]"
            }`}
          >
            <Clock size={14} />
            {expired ? "Approval window expired" : formatCountdown(ms)}
          </div>
        )}
      </div>

      {/* Borrower + Loan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3.5 flex flex-col gap-2 text-sm">
          <p className="text-[#A9C4BE] text-xs uppercase tracking-wider m-0 font-bold flex items-center gap-1.5">
            <User size={11} /> Borrower
          </p>
          <InfoRow label="Name" value={loan.borrowerName || "—"} />
          <InfoRow label="ID number" value={loan.idNumber || "—"} />
          <InfoRow label="Phone" value={loan.phone || "—"} />
        </div>

        <div className="bg-white/5 rounded-xl p-3.5 flex flex-col gap-2 text-sm">
          <p className="text-[#A9C4BE] text-xs uppercase tracking-wider m-0 font-bold flex items-center gap-1.5">
            <CreditCard size={11} /> Loan
          </p>
          <InfoRow label="Requested" value={fmtKES(loan.amount)} />
          {amountOverridden && (
            <InfoRow
              label="Approved"
              value={<span className="text-[#FFB300]">{fmtKES(loan.approvedAmount)}</span>}
            />
          )}
          <InfoRow label="Interest (15%)" value={fmtKES(loan.interest)} />
          <InfoRow
            label="Total due"
            value={<b className="text-[#7FF0DC]">{fmtKES(loan.totalDue)}</b>}
          />
        </div>
      </div>

      {/* Guarantor */}
      <div className="bg-white/5 rounded-xl p-3.5 flex flex-col gap-2 text-sm">
        <p className="text-[#A9C4BE] text-xs uppercase tracking-wider m-0 font-bold flex items-center gap-1.5">
          <ShieldCheck size={11} /> Guarantor
        </p>
        {loan.guarantor ? (
          <div className="grid grid-cols-2 gap-2">
            <InfoRow label="Name" value={loan.guarantor.name || "—"} />
            <InfoRow label="Phone" value={loan.guarantor.phone || "—"} />
            <InfoRow label="ID number" value={loan.guarantor.idNumber || "—"} />
            <InfoRow
              label="Relationship"
              value={loan.guarantor.relationship || "—"}
            />
          </div>
        ) : (
          <p className="text-[#A9C4BE] text-xs m-0">Not provided.</p>
        )}
      </div>

      {/* Signed PDF with Download Button */}
      <SignedPdfViewer 
        url={loan.agreementUrl} 
        title="Signed loan agreement" 
        fileName={`Signed-Agreement-${loan.id}.pdf`}
      />

      {/* Declined reason */}
      {declined && loan.declineReason && (
        <div className="bg-[#FCA5A5]/10 border border-[#FCA5A5]/30 rounded-xl px-3.5 py-2.5 text-sm">
          <p className="m-0 flex items-center gap-1.5 font-bold text-[#FCA5A5]">
            <AlertCircle size={14} /> Declined
          </p>
          <p className="m-0 mt-1 text-[#F0FDF4]/80 text-[13px]">
            {loan.declineReason}
          </p>
        </div>
      )}

      {/* Disbursement info */}
      {(disbursed || repaid) && (
        <div className="bg-[#00BFA5]/10 border border-[#00BFA5]/30 rounded-xl px-3.5 py-2.5 text-sm">
          <p className="m-0 flex items-center gap-1.5 font-bold text-[#7FF0DC]">
            <Check size={14} />
            {repaid ? "Repaid in full" : "Disbursed"}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
            <InfoRow label="Payout number" value={loan.payoutPhone || "—"} />
            {loan.disbursedAt && (
              <InfoRow
                label="Disbursed"
                value={new Date(loan.disbursedAt).toLocaleDateString("en-KE")}
              />
            )}
            {loan.dueDate && (
              <InfoRow
                label="Due date"
                value={new Date(loan.dueDate).toLocaleDateString("en-KE")}
              />
            )}
            {loan.repaidAt && (
              <InfoRow
                label="Repaid"
                value={new Date(loan.repaidAt).toLocaleDateString("en-KE")}
              />
            )}
          </div>
        </div>
      )}

      {/* Pending actions */}
      {pending && (
        <div className="flex gap-2 flex-wrap mt-2">
          <button
            onClick={onApprove}
            className="flex-1 min-h-12 rounded-xl bg-[#FFB300] text-[#0F172A] font-extrabold text-sm hover:brightness-105 inline-flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>
          <button
            onClick={onDecline}
            className="flex-1 min-h-12 rounded-xl border-2 border-[#FCA5A5] text-[#FCA5A5] font-extrabold text-sm hover:bg-[#FCA5A5]/10 inline-flex items-center justify-center gap-2"
          >
            <XIcon size={16} />
            Decline
          </button>
        </div>
      )}

      {/* Approved — disburse panel */}
      {approved && (
        <div className="bg-[rgba(0,191,165,0.08)] border border-[rgba(0,191,165,0.3)] rounded-xl p-4 flex flex-col gap-3 mt-2">
          <div>
            <p className="m-0 font-extrabold text-sm text-[#7FF0DC] flex items-center gap-1.5">
              <Check size={14} /> Approved — ready to disburse
            </p>
            <p className="m-0 text-[#A9C4BE] text-xs mt-1">
              Enter the M-Pesa number to send {fmtKES(loan.amount)} to. The
              30-day repayment window starts the moment you confirm.
            </p>
          </div>

          <div>
            <label htmlFor="payout" className="block text-[13px] font-semibold mb-1.5">
              M-Pesa number
            </label>
            <div className="relative">
              <Phone
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8DA9A3] pointer-events-none"
              />
              <input
                id="payout"
                type="tel"
                inputMode="tel"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl border border-white/45 bg-white/5 text-white px-3.5 pl-10 text-[15px] placeholder:text-[#8DA9A3]"
              />
            </div>
          </div>

          <button
            onClick={onDisburse}
            className="min-h-12 rounded-xl bg-[#00BFA5] text-[#0F172A] font-extrabold text-sm hover:brightness-105 inline-flex items-center justify-center gap-2"
          >
            <Check size={16} />
            Confirm and disburse
          </button>
        </div>
      )}
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#A9C4BE]">{label}</span>
      <span className="text-right font-semibold truncate">{value}</span>
    </div>
  );
}