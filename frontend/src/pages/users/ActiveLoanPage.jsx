import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { toast } from "sonner";
import { K } from "../../utils/constants";
import SupportModal from "../../components/SupportModal"; 

export default function ActiveLoanPage() {
  const navigate = useNavigate();
  const { loan } = useLoan(); // Removed 'repay' since we are routing to the payment page now
  const [isSupportOpen, setIsSupportOpen] = useState(false); 

  const hasLoan = !!loan;
  
  const amountDue = hasLoan ? loan.total : 5750;
  const amountBorrowed = hasLoan ? loan.amount : 5000;
  const dueDateStr = loan?.dueDate
    ? new Date(loan.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "18 Nov 2026";

  const dayCounter = 12; 
  const totalDays = 30;
  const progressPercent = (dayCounter / totalDays) * 100;

  return (
    <div className="flex flex-col gap-5 mt-2">
      
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        
        <div className="bg-[radial-gradient(circle_at_0%_0%,rgba(0,191,165,.3),transparent_60%),#002E26] border border-[#00BFA5]/20 rounded-[20px] p-6 md:p-8 relative overflow-hidden flex flex-col gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <img src="/logob.png" alt="" className="absolute right-[-40px] top-[-20px] w-[280px] h-[280px] opacity-[0.03] pointer-events-none mix-blend-screen" />
          
          <div className="flex justify-between items-start">
            <h2 className="text-[20px] font-extrabold text-white">
              {hasLoan ? "Active loan" : "Welcome to BorrowBee"}
            </h2>
            {hasLoan ? (
              <span className="text-[13px] font-extrabold px-3 py-1 rounded-full bg-[#FFB300] text-[#004D40]">Due in 18 days</span>
            ) : (
              <span className="text-[13px] font-extrabold px-3 py-1 rounded-full bg-[#FFB300] text-[#004D40]">No active loan</span>
            )}
          </div>

          {hasLoan ? (
            <div className="flex flex-wrap items-center gap-8 mt-2 relative z-10">
             
              <div className="relative w-[130px] h-[130px] flex-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" fill="none" stroke="#1B4B41" strokeWidth="6" pathLength="100" />
                  <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" fill="none" stroke="#FFB300" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray={`${progressPercent} 100`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-extrabold text-[14px] leading-tight text-white">
                  <span>Day {dayCounter}</span>
                  <span className="text-[12px] text-white/60 font-semibold">of {totalDays}</span>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <p className="text-[14px] text-[#A9C4BE] mb-1">Amount due</p>
                <div className="text-[44px] font-extrabold leading-none text-white tracking-tight">{K(amountDue)}</div>
                <p className="text-[13px] text-[#A9C4BE] mt-2">
                  Due {dueDateStr} · Borrowed {K(amountBorrowed)} + 15% interest
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 relative z-10">
              <p className="text-[#CFE8DC] text-sm max-w-md leading-relaxed">
                You don't have an active loan right now. Apply today and get approved in 30 minutes.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-2 relative z-10">
            {hasLoan ? (
              <>
                {/* Changed to route to /app/pay */}
                <button onClick={() => navigate("/app/pay")} className="min-h-[46px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors shadow-lg shadow-[#FFB300]/20">
                  Pay {K(amountDue)}
                </button>
                <button onClick={() => toast.info("Agreement PDF opened (demo).")} className="min-h-[46px] px-6 rounded-xl border-2 border-[#00BFA5]/40 text-white font-extrabold text-[15px] hover:bg-[#00BFA5]/10 transition-colors">
                  View agreement
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/app/apply")} className="min-h-[46px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors shadow-lg shadow-[#FFB300]/20">
                Apply for a loan
              </button>
            )}
          </div>
        </div>

        
        <div className="flex flex-col gap-5">
          <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[17px] font-extrabold text-white">Borrower level</h2>
              <span className="text-[12px] font-extrabold px-3 py-1 rounded-full bg-[#00BFA5]/10 text-[#00BFA5]">Trusted</span>
            </div>
            <div className="h-2 rounded-full bg-[#1B4B41]">
              <div className="h-2 rounded-full bg-[#00BFA5] w-[55%]"></div>
            </div>
            <p className="text-[14px] text-[#A9C4BE] leading-relaxed">Repay on time to unlock a higher limit automatically.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-6 flex flex-col gap-1">
            <p className="text-[14px] text-[#A9C4BE] mb-1">Your limit</p>
            <div className="text-[32px] font-extrabold text-white leading-none">{K(5000)}</div>
            <p className="text-[14px] text-[#A9C4BE] mt-2 leading-relaxed">New borrower limit. The lender may raise it after review.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        
        <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-[17px] font-extrabold text-white">Recent activity</h2>
          
          <div className="flex flex-col gap-5 text-[14px]">
            {hasLoan ? (
              <>
                <div className="flex gap-3 items-start">
                  <div className="flex-none w-3 h-3.5 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
                  <div>
                    <b className="block font-bold text-white">Money sent to {loan.phone || "07•• ••• 678"}</b>
                    <span className="text-[13px] text-[#A9C4BE]">19 Oct · {K(amountBorrowed)}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-none w-3 h-3.5 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
                  <div>
                    <b className="block font-bold text-white">Loan approved</b>
                    <span className="text-[13px] text-[#A9C4BE]">19 Oct · after 24 minutes</span>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-none w-3 h-3.5 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
                  <div>
                    <b className="block font-bold text-white">Agreement and guarantor submitted</b>
                    <span className="text-[13px] text-[#A9C4BE]">19 Oct</span>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="flex-none w-3 h-3.5 mt-1 bg-white/20" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
                  <div>
                    <b className="block font-bold text-white">Repay by {dueDateStr}</b>
                    <span className="text-[13px] text-[#A9C4BE]">Automatic reminders on</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="flex-none w-3 h-3.5 mt-1 bg-white/20" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
                <div>
                  <b className="block font-bold text-white">No recent activity</b>
                  <span className="text-[13px] text-[#A9C4BE]">Apply for a loan to get started.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[20px] p-6 md:p-8 flex flex-col items-start gap-3">
          <h2 className="text-[17px] font-extrabold text-white">Need a hand?</h2>
          <p className="text-[14px] text-[#A9C4BE] flex-1 leading-relaxed">
            Chat with support or read how repayment works. [SUPPORT HOURS]
          </p>
          
          <button 
            onClick={() => setIsSupportOpen(true)} 
            className="min-h-[46px] w-full rounded-xl border-2 border-[#00BFA5]/40 text-white font-extrabold text-[15px] hover:bg-[#00BFA5]/10 transition-colors mt-4"
          >
            Message support
          </button>
        </div>
        
      </div>

    
      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        contextInfo={hasLoan ? `Active Loan · ${K(amountDue)}` : "General Inquiry"} 
      />
    </div>
  );
}