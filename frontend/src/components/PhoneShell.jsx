export default function PhoneShell({ children }) {
  return (
    <div
      className="w-[min(390px,100%)] h-[780px] mx-auto border-[9px] border-brand-ink rounded-[42px] overflow-hidden flex flex-col relative
                 bg-gradient-to-b from-[#07241F] to-[#04120F] shadow-[0_30px_80px_rgba(0,191,165,0.25)]"
    >
      {children}
    </div>
  );
}