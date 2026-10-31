import { STATUS } from "../utils/constants";

const LABELS = {
  [STATUS.PENDING]:  ["Under review", "bg-brand-accent text-brand-ink"],
  [STATUS.APPROVED]: ["Approved",     "bg-brand-accent text-brand-ink"],
  [STATUS.ACTIVE]:   ["Active",       "bg-brand-accent text-brand-ink"],
  [STATUS.REPAID]:   ["Repaid",       "bg-brand-secondary text-brand-ink"],
  [STATUS.DECLINED]: ["Declined",     "bg-red-200 text-red-900"],
};

export default function StatusBadge({ status }) {
  const [label, cls] = LABELS[status] || ["—", "bg-white/20"];
  return (
    <span className={`text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}
