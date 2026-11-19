import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoan } from "../../context/LoanContext";
import { useUserAuth } from "../../auth/UserAuthContext";
import { K } from "../../utils/constants";
import SupportModal from "../../components/SupportModal";

export default function MyLoanPage() {
  const navigate = useNavigate();
  const { borrower } = useUserAuth();
  const { loan } = useLoan();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Extract real data from context, with fallbacks if empty
  const amountBorrowed = loan?.amount || 5000;
  const interest = loan?.interest || 750;
  const total = loan?.total || 5750;
  const phone = loan?.phone || "07•• ••• 678";
  
  // Use the actual dates if they exist, otherwise fallbacks
  const sentOn = loan?.createdAt 
    ? new Date(loan.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
    : "19 Oct 2026";
  const dueDate = loan?.dueDate 
    ? new Date(loan.dueDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
    : "18 Nov 2026";

  const progressPercent = 40;

  // --- GENERATE PDF FROM FILLED DETAILS ---
  const handleDownloadAgreement = () => {
    const printWindow = window.open("", "_blank");

    // Extract real guarantor data
    const gName = loan?.guarantor?.name || "Paul M.";
    const gId = loan?.guarantor?.id || "87654321";
    const gPhone = loan?.guarantor?.phone || "0798765432";
    const bName = borrower?.name || "Amina Wanjiru";
    const bId = borrower?.idNumber || "12345678";
    const bPhone = borrower?.phone || "0712345678";

    printWindow.document.write(`
      <html>
        <head>
          <title>BorrowBee Loan Agreement</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { display: flex; align-items: center; gap: 20px; border-bottom: 2px solid #004D40; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { width: 60px; height: 60px; border-radius: 50%; }
            h1 { color: #004D40; margin: 0; font-size: 24px; }
            p.subtitle { margin: 5px 0 0 0; color: #666; font-size: 14px; }
            .section { margin-bottom: 25px; }
            h2 { font-size: 16px; color: #004D40; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .label { color: #666; }
            .value { font-weight: bold; }
            .terms { font-size: 12px; color: #555; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 30px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .sig-line { width: 45%; border-top: 1px solid #333; padding-top: 10px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}/logob.png" class="logo" alt="BorrowBee Logo" />
            <div>
              <h1>BorrowBee</h1>
              <p class="subtitle">Official Loan Agreement</p>
            </div>
          </div>

          <div class="section">
            <h2>Borrower Details</h2>
            <div class="row"><span class="label">Full Name:</span> <span class="value">${bName}</span></div>
            <div class="row"><span class="label">ID Number:</span> <span class="value">${bId}</span></div>
            <div class="row"><span class="label">Phone Number:</span> <span class="value">${bPhone}</span></div>
          </div>

          <div class="section">
            <h2>Loan Details</h2>
            <div class="row"><span class="label">Principal Amount:</span> <span class="value">${K(amountBorrowed)}</span></div>
            <div class="row"><span class="label">Interest (15% flat):</span> <span class="value">${K(interest)}</span></div>
            <div class="row"><span class="label">Total Repayment:</span> <span class="value">${K(total)}</span></div>
            <div class="row"><span class="label">Disbursement Date:</span> <span class="value">${sentOn}</span></div>
            <div class="row"><span class="label">Due Date:</span> <span class="value">${dueDate}</span></div>
            <div class="row"><span class="label">Disbursed To:</span> <span class="value">${phone}</span></div>
          </div>

          <div class="section">
            <h2>Guarantor Details</h2>
            <div class="row"><span class="label">Full Name:</span> <span class="value">${gName}</span></div>
            <div class="row"><span class="label">ID Number:</span> <span class="value">${gId}</span></div>
            <div class="row"><span class="label">Phone Number:</span> <span class="value">${gPhone}</span></div>
          </div>

          <div class="terms">
            <strong>Terms & Conditions:</strong><br/>
            By accepting this loan, the borrower agrees to repay the total amount of ${K(total)} on or before ${dueDate}. 
            The interest is calculated at a flat rate of 15% for the 30-day period. Late payments may incur additional fees and will be reported to the relevant credit bureaus. The guarantor agrees to be held liable in the event that the borrower defaults on this agreement.
          </div>

          <div class="signature">
            <div class="sig-line">Borrower Signature</div>
            <div class="sig-line">Lender / System Authorized Signature</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      toast.success("Agreement ready. Use your browser's print dialog to save as PDF.");
    }, 500);
  };

  return (
    <div className="flex flex-col gap-5 mt-2 w-full max-w-[1100px]">
      
      {/* Hero Card */}
      <div className="bg-[#004D40] border border-[#00BFA5]/20 rounded-[24px] p-6 md:p-8 relative overflow-hidden flex flex-col gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
        {/* Bee Watermark */}
        <img src="/logob.png" alt="" className="absolute right-[-20px] top-0 w-[220px] h-[220px] opacity-[0.07] pointer-events-none mix-blend-screen" />
        
        <div className="flex justify-between items-start">
          <h2 className="text-[20px] font-extrabold text-white">Active loan</h2>
          <span className="text-[13px] font-extrabold px-3 py-1 rounded-full bg-[#FFB300] text-[#004D40]">Due in 18 days</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 md:gap-10 mt-2 relative z-10">
          {/* Hexagon Ring */}
          <div className="relative w-[120px] h-[120px] flex-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" fill="none" stroke="#1B6B5E" strokeWidth="6" pathLength="100" />
              <polygon points="50,5 91,28 91,72 50,95 9,72 9,28" fill="none" stroke="#FFB300" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray={`${progressPercent} 100`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-extrabold text-[14px] leading-tight text-white">
              <span>Day 12</span>
              <span className="text-[12px] text-white/70 font-semibold">of 30</span>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <p className="text-[14px] text-[#CFE8DC] mb-1">Amount due</p>
            <div className="text-[44px] font-extrabold leading-none text-white tracking-tight">{K(total)}</div>
            <p className="text-[14px] text-[#CFE8DC] mt-2">Due {dueDate}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2 relative z-10">
          <button 
            onClick={() => navigate("/app/pay")} 
            className="min-h-[46px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors"
          >
            Pay {K(total)}
          </button>
          <button 
            onClick={handleDownloadAgreement} 
            className="min-h-[46px] px-6 rounded-xl border-2 border-[#00BFA5] text-white font-extrabold text-[15px] hover:bg-white/5 transition-colors"
          >
            Download my agreement
          </button>
        </div>
      </div>

      {/* Grid: Details & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Loan Details */}
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-[18px] font-extrabold text-white mb-2">Loan details</h2>
          
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Borrowed</span>
            <b className="text-white font-extrabold">{K(amountBorrowed)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Interest (15%)</span>
            <b className="text-white font-extrabold">{K(interest)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Total to repay</span>
            <b className="text-white font-extrabold">{K(total)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Sent on</span>
            <b className="text-white font-extrabold">{sentOn}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Sent to</span>
            <b className="text-white font-extrabold">{phone}</b>
          </div>
        </div>

        {/* Repayment Timeline */}
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-[18px] font-extrabold text-white">Repayment timeline</h2>
          
          <div className="flex flex-col gap-5 text-[15px]">
            
            <div className="flex gap-3 items-start">
              <div className="flex-none w-3 h-3.5 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
              <div>
                <b className="block font-bold text-white">Money sent</b>
                <span className="text-[13px] text-[#A9C4BE]">{sentOn}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-none w-3 h-3.5 mt-1 bg-white/20" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
              <div>
                <b className="block font-bold text-white">Automatic reminder</b>
                <span className="text-[13px] text-[#A9C4BE]">3 days before due date</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="flex-none w-3 h-3.5 mt-1 bg-white/20" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
              <div>
                <b className="block font-bold text-white">Due date</b>
                <span className="text-[13px] text-[#A9C4BE]">{dueDate} · payment detected automatically</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid: Guarantor & Paying Later */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        
        {/* Guarantor */}
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-[18px] font-extrabold text-white mb-2">Your guarantor</h2>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Name</span>
            <b className="text-white font-extrabold">{loan?.guarantor?.name || "Paul M."}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Phone</span>
            <b className="text-white font-extrabold">{loan?.guarantor?.phone || "0798765432"}</b>
          </div>
        </div>

       
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-3">
          <h2 className="text-[18px] font-extrabold text-white mb-1">Paying later?</h2>
          <p className="text-[14px] text-[#A9C4BE] leading-relaxed mb-2 flex-1">
            Pay any time before the due date. When your payment arrives, this page and your level update automatically.
          </p>
          
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="h-[46px] w-full rounded-xl border-2 border-[#00BFA5]/40 text-white font-extrabold text-[15px] hover:bg-[#00BFA5]/10 transition-colors mt-auto"
          >
            Message support
          </button>
        </div>

      </div>

      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
        contextInfo={`My Loan · ${K(total)}`} 
      />
    </div>
  );
}