// src/pages/developers/DeveloperDashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  DollarSign,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { loanApi } from "../../api/loanApi";
import { useToast } from "../../context/ToastContext";
import { STATUS } from "../../utils/constants";
import ApprovalQueue from "../../components/ApprovalQueue";
import RepaymentsTable from "../../components/RepaymentsTable";

// Fallbacks in case STATUS is missing some keys in constants.js
const S = {
  PENDING:   STATUS?.PENDING   ?? "PENDING",
  APPROVED:  STATUS?.APPROVED  ?? "APPROVED",
  DECLINED:  STATUS?.DECLINED  ?? "DECLINED",
  DISBURSED: STATUS?.DISBURSED ?? "DISBURSED",
  REPAID:    STATUS?.REPAID    ?? "REPAID",
};

// Demo growth data — swap for a real time-series endpoint later.
const GROWTH = [
  { month: "Jun", disbursed: 38,  collected: 29 },
  { month: "Jul", disbursed: 52,  collected: 46 },
  { month: "Aug", disbursed: 67,  collected: 63 },
  { month: "Sep", disbursed: 90,  collected: 84 },
  { month: "Oct", disbursed: 100, collected: 86 },
];

const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

function relativeTime(iso) {
  if (!iso) return "just now";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;
  return `${Math.floor(hr / 24)} d ago`;
}

function computeStats(loans) {
  const pending        = loans.filter((l) => l.status === S.PENDING).length;
  const approved       = loans.filter((l) => l.status === S.APPROVED).length;
  const disbursedList  = loans.filter((l) => l.status === S.DISBURSED);
  const repaidList     = loans.filter((l) => l.status === S.REPAID);

  const overdue = disbursedList.filter(
    (l) => l.dueDate && new Date(l.dueDate).getTime() < Date.now()
  ).length;

  const totalRequested = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
  const totalDisbursed = [...disbursedList, ...repaidList].reduce(
    (sum, l) => sum + (l.amount || 0),
    0
  );
  const totalPaidBack = repaidList.reduce(
    (sum, l) => sum + (l.totalDue || l.amount || 0),
    0
  );
  const outstanding = disbursedList.reduce(
    (sum, l) => sum + (l.totalDue || l.amount || 0),
    0
  );

  const approvedCount = approved + disbursedList.length + repaidList.length;

  return {
    pending,
    approved,
    overdue,
    totalRequested,
    totalDisbursed,
    totalPaidBack,
    outstanding,
    requestedCount: loans.length,
    disbursedCount: disbursedList.length,
    repaidCount:    repaidList.length,
    approvedCount,
    dueTotal:       outstanding + totalPaidBack,
  };
}

export default function DeveloperDashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loans, setLoans] = useState([]);

  async function refresh() {
    try {
      setLoans(await loanApi.listLoans());
    } catch (e) {
      toast(e?.message || "Could not load loans");
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = computeStats(loans);

  // Loan funnel — percentages derived from counts (avoids div-by-zero)
  const funnel = [
    { label: "Requested",    value: s.requestedCount, pct: s.requestedCount ? 100 : 0 },
    {
      label: "Approved",
      value: s.approvedCount,
      pct: s.requestedCount
        ? Math.round((s.approvedCount / s.requestedCount) * 100)
        : 0,
    },
    {
      label: "Disbursed",
      value: s.disbursedCount + s.repaidCount,
      pct: s.requestedCount
        ? Math.round(((s.disbursedCount + s.repaidCount) / s.requestedCount) * 100)
        : 0,
    },
    {
      label: "Fully repaid",
      value: s.repaidCount,
      pct: s.requestedCount
        ? Math.round((s.repaidCount / s.requestedCount) * 100)
        : 0,
    },
  ];

  // Live activity — latest 4 loans, most recent first
  const activity = [...loans]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 4)
    .map((l) => {
      let text = "Loan requested";
      if (l.status === S.APPROVED)  text = "Loan approved";
      if (l.status === S.DISBURSED) text = "Loan disbursed";
      if (l.status === S.REPAID)    text = "Payment received";
      if (l.status === S.DECLINED)  text = "Request declined";
      return {
        text,
        sub: `${l.borrowerName || "Borrower"} · ${relativeTime(l.createdAt)}`,
      };
    });

  return (
    <div className="flex flex-col gap-4">
      {/* ---------- Page heading (topbar handles avatar + bell) ---------- */}
      <div>
        <h2 className="text-2xl font-extrabold">Lender overview</h2>
        <p className="text-[#A9C4BE] text-[13px] leading-relaxed mt-1 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[rgba(0,191,165,0.2)] text-[#7FF0DC] px-2.5 py-1 rounded-full">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
            Live
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#FFB300] text-[#0F172A] px-2.5 py-1 rounded-full">
            Sample data
          </span>
          <span>Everything refreshes automatically.</span>
        </p>
      </div>

      {/* ---------- Section 1: Action tiles ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <ActionTile
          tone="warn"
          count={s.pending}
          label="loan requests to approve"
          onClick={() => navigate("/admin/requests")}
        />
        <ActionTile
          tone="warn"
          count={0 /* replace with pending payment confirmations once wired */}
          label="payments to confirm"
          onClick={() => navigate("/admin/payments")}
        />
        <ActionTile
          tone="danger"
          count={s.overdue}
          label="loans past their due date"
          onClick={() => navigate("/admin/payments")}
        />
        <ActionTile
          tone="warn"
          count={0 /* replace with unread support count once wired */}
          label="support messages"
          onClick={() => navigate("/admin/support")}
        />
      </div>

      {/* ---------- Section 2: Stats grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="Total requested"
          value={fmtKES(s.totalRequested)}
          sub={`${s.requestedCount} request${s.requestedCount === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Total disbursed"
          value={fmtKES(s.totalDisbursed)}
          sub={`${s.disbursedCount + s.repaidCount} loan${s.disbursedCount + s.repaidCount === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Total paid back"
          value={fmtKES(s.totalPaidBack)}
          sub={`of ${fmtKES(s.dueTotal)} due`}
        />
        <StatCard
          label="Outstanding"
          value={fmtKES(s.outstanding)}
          sub={`${s.disbursedCount} loan${s.disbursedCount === 1 ? "" : "s"}`}
          valueClass="text-[#FFB300]"
        />
      </div>

      {/* ---------- Section 3: Growth chart + right column ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Growth chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 min-w-0">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <h3 className="text-[17px] font-extrabold m-0">Growth tracker</h3>
            <span className="text-xs font-extrabold bg-[rgba(0,191,165,0.2)] text-[#7FF0DC] px-2.5 py-1 rounded-full">
              +10.5% disbursed · +2.3% collected
            </span>
          </div>

          <div
            className="flex gap-3 items-end h-[170px] pt-1.5"
            role="img"
            aria-label="Bar chart of money disbursed and collected, June to October"
          >
            {GROWTH.map((g) => (
              <div
                key={g.month}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
              >
                <div className="flex gap-1 items-end flex-1 w-full justify-center">
                  <div
                    className="w-4 rounded-t-[5px] bg-[#004D40]"
                    style={{ height: `${g.disbursed}%` }}
                  />
                  <div
                    className="w-4 rounded-t-[5px] bg-[#00BFA5]"
                    style={{ height: `${g.collected}%` }}
                  />
                </div>
                <span className="text-[#A9C4BE] text-[13px]">{g.month}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 text-[13px]">
            <span className="text-[#A9C4BE] flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded bg-[#004D40]" />
              Disbursed
            </span>
            <span className="text-[#A9C4BE] flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded bg-[#00BFA5]" />
              Collected
            </span>
          </div>
        </div>

        {/* Right column: funnel + activity */}
        <div className="flex flex-col gap-4">
          {/* Funnel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-[17px] font-extrabold m-0">Loan funnel</h3>
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between gap-2.5 text-sm">
                  <span>{f.label}</span>
                  <b>{f.value}</b>
                </div>
                <div className="h-3 rounded-md bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-md bg-[#00BFA5]"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live activity */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-[17px] font-extrabold m-0">Live activity</h3>
            <div className="flex flex-col gap-3 text-sm">
              {activity.length === 0 && (
                <p className="text-[#A9C4BE] text-[13px]">No recent activity.</p>
              )}
              {activity.map((a, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="shrink-0 w-3 h-3 mt-1 bg-[#00BFA5] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  <span>
                    {a.text}
                    <br />
                    <span className="text-[#A9C4BE] text-[13px]">{a.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Section 4: Approval queue (functional, below overview) ---------- */}
      <section className="flex flex-col gap-2">
        <h3 className="text-[17px] font-extrabold m-0">Pending approvals</h3>
        <ApprovalQueue
          loans={loans}
          onApprove={async (id) => {
            await loanApi.approve(id);
            toast("Approved.");
            refresh();
          }}
          onDecline={async (id) => {
            await loanApi.decline(id);
            toast("Declined.");
            refresh();
          }}
        />
      </section>

      {/* ---------- Section 5: Repayments (functional, below overview) ---------- */}
      <section className="flex flex-col gap-2">
        <h3 className="text-[17px] font-extrabold m-0">Repayments</h3>
        <RepaymentsTable
          loans={loans}
          onRemind={() => toast("Reminder sent (mock).")}
          onMarkPaid={async (id) => {
            await loanApi.repay(id);
            toast("Marked as paid.");
            refresh();
          }}
        />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small local sub-components — kept here so the page is self-contained */
/* ------------------------------------------------------------------ */

function ActionTile({ tone = "warn", count = 0, label = "", onClick }) {
  const badge =
    tone === "danger"
      ? "bg-[#FCA5A5] text-[#450A0A]"
      : "bg-[#FFB300] text-[#0F172A]";

  const Icon =
    tone === "danger"
      ? AlertTriangle
      : label.includes("support")
      ? MessageSquare
      : label.includes("payment")
      ? DollarSign
      : ClipboardList;

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 min-w-0 hover:border-[#00BFA5] transition-colors"
    >
      <span
        className={`inline-flex items-center gap-1.5 self-start text-xs font-extrabold ${badge} px-2.5 py-1 rounded-full`}
      >
        <Icon size={11} strokeWidth={2.6} />
        {tone === "danger" ? "Overdue" : "Needs action"}
      </span>
      <span className="text-[26px] font-extrabold leading-tight">{count}</span>
      <span className="text-[#A9C4BE] text-[13px]">{label}</span>
    </button>
  );
}

function StatCard({ label, value, sub, valueClass = "" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 min-w-0">
      <span className="text-[#A9C4BE] text-[13px]">{label}</span>
      <b className={`text-[28px] leading-tight block ${valueClass}`}>{value}</b>
      <span className="text-[#A9C4BE] text-[13px]">{sub}</span>
    </div>
  );
}