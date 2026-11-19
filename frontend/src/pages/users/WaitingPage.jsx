import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  Info, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  X,
  ArrowRight
} from "lucide-react";
import { useLoan } from "../../context/LoanContext";
import { STATUS } from "../../utils/constants";

const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

export default function WaitingPage() {
  const { loan } = useLoan();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const status = loan?.status || "PENDING";
  const amount = loan?.amount || 5000;
  const interest = loan?.interest || Math.round(amount * 0.15);
  const totalToRepay = loan?.totalDue || amount + interest;

  // Timer logic (only runs if status is PENDING)
  useEffect(() => {
    if (status !== "PENDING" || !loan?.createdAt) return;

    const calculateTimeLeft = () => {
      const createdAt = new Date(loan.createdAt).getTime();
      const expireTime = createdAt + 30 * 60 * 1000;
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expireTime - now) / 1000));
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [loan?.createdAt, status]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-[#A9C4BE]">No active loan application found.</p>
        <button
          onClick={() => navigate("/app/apply")}
          className="bg-[#FFB300] text-[#0F172A] font-bold px-6 py-3 rounded-xl"
        >
          Go to Apply
        </button>
      </div>
    );
  }

  // Determine modal display info
  const getStatusDisplay = () => {
    switch (status) {
      case "PENDING":
        return {
          icon: <Clock className="text-[#FFB300]" size={32} />,
          title: "Under Review",
          desc: "Your application and signed agreement are currently being reviewed by the lender.",
          color: "text-[#FFB300]",
        };
      case "APPROVED":
        return {
          icon: <CheckCircle2 className="text-[#00BFA5]" size={32} />,
          title: "Loan Approved!",
          desc: "Congratulations! Your loan has been approved. Please proceed to enter your M-Pesa number to receive the funds.",
          color: "text-[#00BFA5]",
        };
      case "DECLINED":
        return {
          icon: <XCircle className="text-[#FCA5A5]" size={32} />,
          title: "Application Declined",
          desc: loan.declineReason
            ? `Unfortunately, your application was declined. Reason: ${loan.declineReason}`
            : "Unfortunately, your application was declined. Please contact support for more details.",
          color: "text-[#FCA5A5]",
        };
      case "DISBURSED":
        return {
          icon: <CheckCircle2 className="text-[#7FF0DC]" size={32} />,
          title: "Funds Disbursed",
          desc: "The money has been sent to your M-Pesa. Your 30-day repayment window has started.",
          color: "text-[#7FF0DC]",
        };
      default:
        return {
          icon: <Info className="text-[#A9C4BE]" size={32} />,
          title: "Processing",
          desc: "Your application is being processed.",
          color: "text-white",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto mt-4">
      
      {/* Dynamic Main Card */}
      <div 
        className={`border rounded-xl p-6 flex flex-col items-center justify-center shadow-lg transition-colors duration-500 ${
          status === "PENDING" ? "bg-[#004D40] border-[#00BFA5]/30" :
          status === "APPROVED" ? "bg-[#00BFA5]/20 border-[#00BFA5]" :
          status === "DECLINED" ? "bg-[#FCA5A5]/10 border-[#FCA5A5]/30" :
          "bg-[#00BFA5]/30 border-[#7FF0DC]"
        }`}
      >
        <h2 className="text-xl font-extrabold text-white m-0 flex items-center gap-2">
          {status === "PENDING" && <FileText size={20} className="text-[#7FF0DC]" />}
          {status === "PENDING" ? "Under review" : statusDisplay.title}
        </h2>
        {status !== "PENDING" && (
          <p className="text-white text-sm mt-2 text-center max-w-md">
            {statusDisplay.desc}
          </p>
        )}
      </div>

      {/* Timer (Only shows if Pending) */}
      {status === "PENDING" && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-[64px] font-extrabold text-white leading-none tracking-tight">
            {formatTime(timeLeft)}
          </div>
          <p className="text-[#A9C4BE] text-sm mt-2">about 30 minutes</p>
          <p className="text-white text-sm mt-4 text-center max-w-md">
            We received your signed form. You will get a notification as soon as a
            decision is made.
          </p>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-1">
        <p className="text-white font-bold m-0 text-lg">
          Request: {fmtKES(amount)}
        </p>
        <p className="text-[#A9C4BE] text-sm m-0">
          Total to repay: {fmtKES(totalToRepay)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 rounded-xl border-2 border-[#00BFA5] text-[#00BFA5] font-extrabold text-lg hover:bg-[#00BFA5]/10 transition-colors flex items-center justify-center gap-2"
        >
          <Info size={20} />
          Check status
        </button>

        {/* If Approved, prompt them to go to Payout */}
        {status === "APPROVED" && (
          <button
            onClick={() => navigate("/app/payout")}
            className="w-full py-4 rounded-xl bg-[#FFB300] text-[#0F172A] font-extrabold text-lg hover:brightness-110 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            Enter Payout Number
            <ArrowRight size={20} />
          </button>
        )}

        {/* If Disbursed, prompt them to view active loan */}
        {status === "DISBURSED" && (
          <button
            onClick={() => navigate("/app/loan")}
            className="w-full py-4 rounded-xl bg-[#00BFA5] text-[#0F172A] font-extrabold text-lg hover:brightness-110 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            View My Loan
            <ArrowRight size={20} />
          </button>
        )}
      </div>

      {/* STATUS MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#0B2A25] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-extrabold text-lg m-0">Application Status</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#A9C4BE] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-white/5 rounded-full mb-2">
                {statusDisplay.icon}
              </div>
              <h4 className={`text-xl font-extrabold m-0 ${statusDisplay.color}`}>
                {statusDisplay.title}
              </h4>
              <p className="text-[#A9C4BE] text-sm leading-relaxed m-0">
                {statusDisplay.desc}
              </p>
              
              <div className="w-full bg-white/5 rounded-lg p-3 mt-4 border border-white/10 flex justify-between">
                <span className="text-[#A9C4BE] text-sm">Loan ID</span>
                <span className="text-white font-mono text-sm">{loan.id}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-[#00BFA5] text-[#0F172A] font-extrabold rounded-xl text-sm hover:brightness-110 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}