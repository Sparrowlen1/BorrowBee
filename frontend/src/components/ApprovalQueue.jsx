import { K } from "../utils/constants";

export default function ApprovalQueue({ loans, onApprove, onDecline }) {
  const pending = loans.filter((l) => l.status === "pending");
  return (
    <div className="bg-white/[0.07] border border-white/15 rounded-xl p-4">
      <h2 className="text-lg font-extrabold text-brand-secondary mb-3">Approval queue</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-white/60">No requests waiting.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-white/60 text-xs">
                <th className="text-left p-2">Borrower</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Guarantor</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((l) => (
                <tr key={l.id} className="border-t border-white/10">
                  <td className="p-2">{l.name} · {l.idNumber}</td>
                  <td className="p-2">{K(l.amount)}</td>
                  <td className="p-2">{l.guarantor?.name || "—"}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => onApprove(l.id)} className="px-3 py-1 rounded bg-brand-accent text-brand-ink font-extrabold">
                      Approve
                    </button>
                    <button onClick={() => onDecline(l.id)} className="px-3 py-1 rounded border border-brand-secondary text-brand-secondary font-extrabold">
                      Decline
                    </button>
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
