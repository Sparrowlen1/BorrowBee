const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct"];
const DISBURSED = [40000, 55000, 70000, 95000, 105000];
const COLLECTED = [30000, 48000, 66000, 88000, 90000];

export default function GrowthChart() {
  const mx = Math.max(...DISBURSED, ...COLLECTED);
  return (
    <div className="bg-white/[0.07] border border-white/15 rounded-xl p-4">
      <h2 className="text-lg font-extrabold text-brand-secondary mb-3">Growth tracker</h2>
      <div className="flex items-end gap-3 h-[160px]">
        {MONTHS.map((m, i) => (
          <div key={m} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-1 h-[140px]">
              <i className="w-3 bg-brand-primary rounded-t" style={{ height: `${(DISBURSED[i] / mx) * 140}px` }} />
              <i className="w-3 bg-brand-secondary rounded-t" style={{ height: `${(COLLECTED[i] / mx) * 140}px` }} />
            </div>
            <span className="text-xs text-white/60">{m}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-white/60">
        <span><i className="inline-block w-3 h-3 rounded bg-brand-primary mr-1 align-middle" />Disbursed</span>
        <span><i className="inline-block w-3 h-3 rounded bg-brand-secondary mr-1 align-middle" />Collected</span>
      </div>
    </div>
  );
}
