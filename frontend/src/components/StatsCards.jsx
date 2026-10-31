export default function StatsCards({ loans }) {
  const pending = loans.filter((l) => l.status === "pending").length;
  const active = loans.filter((l) => l.status === "active").length;
  const collected = loans.filter((l) => l.status === "repaid").reduce((s, l) => s + l.total, 0);

  const cards = [
    ["Awaiting approval", pending],
    ["Active loans", active],
    ["Collected", `KES ${collected.toLocaleString()}`],
    ["New user limit", "KES 5,000"],
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(([k, v]) => (
        <div key={k} className="bg-white/[0.07] border border-white/15 rounded-xl p-4">
          <div className="text-xs text-white/60">{k}</div>
          <div className="text-2xl font-extrabold text-brand-secondary mt-1">{v}</div>
        </div>
      ))}
    </div>
  );
}
