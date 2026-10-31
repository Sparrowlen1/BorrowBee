import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { INTEREST_RATE, K, MIN_AMOUNT, total } from "../../utils/constants";

export default function ApplyPage() {
  const navigate = useNavigate();
  const { limit } = useLoan();
  const [amount, setAmount] = useState(Math.min(5000, limit));
  
  const interest = useMemo(() => Math.round(amount * INTEREST_RATE), [amount]);

  const steps = [
    { id: 1, label: "1 Amount", active: true },
    { id: 2, label: "2 Agreement", active: false },
    { id: 3, label: "3 Review", active: false },
    { id: 4, label: "4 Payout", active: false },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1100px]">
      
      {/* Custom Stepper */}
      <div className="flex w-full gap-2 md:gap-4 mb-2">
        {steps.map((step) => (
          <div key={step.id} className="flex-1 flex flex-col gap-2">
            <div className={`h-1.5 w-full rounded-full ${step.active ? 'bg-[#FFB300]' : 'bg-[#2A3531]'}`} />
            <span className={`text-[13px] font-bold ${step.active ? 'text-[#FFB300]' : 'text-[#A9C4BE]'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        
        {/* Left Card: Amount Selector */}
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-4">
          <label className="text-[19px] font-extrabold text-white block">How much do you need?</label>
          
          <div className="text-[54px] font-extrabold leading-none text-white tracking-tight mt-1">
            {K(amount)}
          </div>
          
          {/* Custom Range Slider */}
          <div className="mt-4 mb-2 relative w-full">
            <input 
              type="range" 
              min={MIN_AMOUNT} 
              max={limit} 
              step={500} 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none slider-thumb"
              style={{
                background: `linear-gradient(to right, #00BFA5 ${((amount - MIN_AMOUNT) / (limit - MIN_AMOUNT)) * 100}%, #2A3531 ${((amount - MIN_AMOUNT) / (limit - MIN_AMOUNT)) * 100}%)`
              }}
            />
            <style>{`
              .slider-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #00BFA5;
                cursor: pointer;
                border: 3px solid #111A17;
                box-shadow: 0 0 10px rgba(0,191,165,0.5);
              }
              .slider-thumb::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #00BFA5;
                cursor: pointer;
                border: 3px solid #111A17;
              }
            `}</style>
          </div>

          <div className="flex justify-between items-center text-[14px] font-bold text-[#A9C4BE]">
            <span>{K(MIN_AMOUNT)}</span>
            <span>Limit {K(limit)}</span>
          </div>

          <p className="text-[14px] text-[#A9C4BE] mt-2">
            New borrower limit. The lender may raise it after review.
          </p>

          <button 
            onClick={() => navigate("/app/agreement", { state: { amount } })}
            className="mt-6 h-[52px] px-8 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors w-fit shadow-lg shadow-[#FFB300]/10"
          >
            Continue to agreement
          </button>
        </div>

        {/* Right Card: Loan Summary */}
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-[19px] font-extrabold text-white mb-2">Loan summary</h2>
          
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Amount</span>
            <b className="text-white font-extrabold">{K(amount)}</b>
          </div>
          
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Interest (15%)</span>
            <b className="text-white font-extrabold">{K(interest)}</b>
          </div>
          
          <div className="flex justify-between items-center text-[15px] mt-2">
            <span className="text-[#A9C4BE]">Total to repay</span>
            <b className="text-[#00BFA5] font-extrabold text-[18px]">{K(total(amount))}</b>
          </div>
          
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Repay within</span>
            <b className="text-white font-extrabold">30 days</b>
          </div>

          <div className="h-px w-full bg-white/10 my-2" />

          <p className="text-[13px] text-[#A9C4BE] leading-relaxed">
            No hidden fees. Your payment is detected automatically.
          </p>
        </div>
        
      </div>
    </div>
  );
}