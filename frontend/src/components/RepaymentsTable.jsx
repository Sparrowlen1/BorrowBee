import { K } from "../utils/constants";

export default function RepaymentsTable({ loans, onRemind, onMarkPaid }) {
  const rows = loans.filter((l) => ["active", "repaid"].includes(l.status));
  return (
    <div className="bg-white/[0.07] border border-white/15 rounded-xl p-4">
      <h2 className="text-lg font-extrabold text-brand-secondary mb-3">Repayments</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-white/60">Loans appear here once money is sent.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-white/60 text-xs">
                <th className="text-left p-2">Borrower</th>
                <th className="text-left p-2">Due</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-white/10">
                  <td className="p-2">{l.name}</td>
                  <td className="p-2">{l.dueDate ? new Date(l.dueDate).toLocaleDateString() : "—"}</td>
                  <td className="p-2">{K(l.total)}</td>
                  <td className="p-2">{l.status === "active" ? "Not yet paid" : "Paid"}</td>
                  <td className="p-2 flex gap-2">
                    {l.status === "active" && (
                      <>
                        <button onClick={() => onRemind(l.id)} className="px-3 py-1 rounded bg-brand-accent text-brand-ink font-extrabold">
                          Send reminder
                        </button>
                        <button onClick={() => onMarkPaid(l.id)} className="px-3 py-1 rounded border border-brand-secondary text-brand-secondary font-extrabold">
                          Mark paid
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
