import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { K } from "../../utils/constants";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export default function PayLoanPage() {
  const navigate = useNavigate();
  const { loan, repay } = useLoan();
  const [activeTab, setActiveTab] = useState("mpesa"); // 'mpesa' | 'card' | 'manual'
  
  const [phone, setPhone] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Fallback data
  const amountDue = loan?.total || 5750;
  const amountBorrowed = loan?.amount || 5000;
  const interest = loan?.interest || 750;
  const dueDateStr = "18 Nov 2026";

  const handleCopy = () => {
    navigator.clipboard.writeText("0703950378");
    setCopied(true);
    toast.success("Number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async (method) => {
    if (method === "mpesa" && !phone) return toast.error("Enter your M-Pesa phone number.");
    if (method === "manual" && !manualCode) return toast.error("Enter the confirmation code.");
    
    toast.loading(`Processing payment via ${method}...`, { id: "payment" });
    
    setTimeout(async () => {
      await repay(); // Mark loan as repaid in context
      toast.success("Payment successful! Loan marked as paid.", { id: "payment" });
      navigate("/app/history");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start mt-2 w-full max-w-[1100px]">
      
      {/* Left Column: Payment Methods */}
      <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-6 min-h-[500px]">
        
        {/* Tabs */}
        <div className="bg-[#1A2521] p-1.5 rounded-xl flex gap-1">
          <button 
            onClick={() => setActiveTab("mpesa")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'mpesa' ? 'bg-[#00BFA5] text-[#004D40]' : 'text-[#A9C4BE] hover:text-white'}`}
          >
            M-Pesa
          </button>
          <button 
            onClick={() => setActiveTab("card")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'card' ? 'bg-[#00BFA5] text-[#004D40]' : 'text-[#A9C4BE] hover:text-white'}`}
          >
            Card
          </button>
          <button 
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === 'manual' ? 'bg-[#00BFA5] text-[#004D40]' : 'text-[#A9C4BE] hover:text-white'}`}
          >
            Pay manually
          </button>
        </div>

        {/* --- M-Pesa Tab --- */}
        {activeTab === "mpesa" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-[18px] font-extrabold text-white mb-1">Pay with M-Pesa</h2>
              <p className="text-[14px] text-[#A9C4BE]">Enter the number to charge. You will get a prompt on your phone to enter your M-Pesa PIN.</p>
            </div>
            
            <div>
              <label className="text-[14px] font-semibold text-white block mb-2">M-Pesa phone number</label>
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors"
              />
            </div>

            <button 
              onClick={() => handlePayment("M-Pesa")}
              className="h-[48px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors w-fit mt-4"
            >
              Pay {K(amountDue)}
            </button>
          </div>
        )}

        {/* --- Card Tab --- */}
        {activeTab === "card" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-[18px] font-extrabold text-white mb-1">Pay with card</h2>
              <p className="text-[14px] text-[#A9C4BE]">Your card details are sent securely to the payment provider and are never stored by BorrowBee.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[14px] font-semibold text-white block mb-2">Name on card</label>
                <input type="text" placeholder="Amina Wanjiru" className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors" />
              </div>
              <div>
                <label className="text-[14px] font-semibold text-white block mb-2">Card number</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[14px] font-semibold text-white block mb-2">Expiry (MM/YY)</label>
                  <input type="text" placeholder="MM/YY" className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] font-semibold text-white block mb-2">CVV</label>
                  <input type="text" placeholder="123" className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => handlePayment("Card")}
              className="h-[48px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors w-fit mt-4"
            >
              Pay {K(amountDue)}
            </button>
          </div>
        )}

        {/* --- Pay Manually Tab --- */}
        {activeTab === "manual" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-[18px] font-extrabold text-white mb-1">Send it yourself</h2>
              <p className="text-[14px] text-[#A9C4BE]">Prefer your own M-Pesa menu? Send the money to BorrowBee, then tell us the confirmation code.</p>
            </div>
            
            {/* Number Box */}
            <div className="border border-dashed border-white/30 rounded-xl p-4 flex justify-between items-center bg-white/[0.02]">
              <div>
                <p className="text-[13px] text-[#A9C4BE]">BorrowBee M-Pesa number</p>
                <div className="text-[24px] font-extrabold text-white tracking-wider">0703950378</div>
              </div>
              <button 
                onClick={handleCopy}
                className="h-10 px-4 rounded-lg border border-[#00BFA5] text-[#00BFA5] font-bold text-[13px] flex items-center gap-2 hover:bg-[#00BFA5]/10 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy number"}
              </button>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2 text-[14px] text-white">
              <p><span className="font-bold">1.</span> Open M-Pesa and choose <b>Send Money</b>.</p>
              <p><span className="font-bold">2.</span> Enter <b>0703950378</b> (BorrowBee) and the amount <b>{K(amountDue)}</b>.</p>
              <p><span className="font-bold">3.</span> Enter your PIN and send.</p>
              <p><span className="font-bold">4.</span> Type the confirmation code from the M-Pesa message below.</p>
            </div>

            {/* Code Input */}
            <div className="mt-2">
              <label className="text-[14px] font-semibold text-white block mb-2">M-Pesa confirmation code</label>
              <input
                type="text"
                placeholder="E.G. SJK4X9ABCD"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-[#00BFA5] transition-colors uppercase"
              />
            </div>

            <button 
              onClick={() => handlePayment("Manual M-Pesa")}
              className="h-[48px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors w-fit mt-2"
            >
              I have paid
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Summary */}
      <div className="flex flex-col gap-5">
        
        {/* Amount Due Card */}
        <div className="bg-[#004D40] border border-[#00BFA5]/20 rounded-[24px] p-6 md:p-8 relative overflow-hidden flex flex-col gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <img src="/logob.png" alt="" className="absolute right-[-30px] top-[-10px] w-[200px] h-[200px] opacity-10 pointer-events-none mix-blend-screen" />
          
          <p className="text-[15px] text-[#CFE8DC] relative z-10">Amount due</p>
          <div className="text-[44px] font-extrabold leading-none text-white tracking-tight relative z-10">{K(amountDue)}</div>
          <div className="relative z-10 mt-2">
            <span className="text-[13px] font-extrabold px-3 py-1 rounded-full bg-[#FFB300] text-[#004D40]">Due {dueDateStr}</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-[18px] font-extrabold text-white mb-2">Payment summary</h2>
          
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Borrowed</span>
            <b className="text-white font-extrabold">{K(amountBorrowed)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#A9C4BE]">Interest (15%)</span>
            <b className="text-white font-extrabold">{K(interest)}</b>
          </div>
          <div className="flex justify-between items-center text-[15px] mt-2">
            <span className="text-[#A9C4BE]">Total to repay</span>
            <b className="text-[#00BFA5] font-extrabold text-[18px]">{K(amountDue)}</b>
          </div>
        </div>

        {/* Paid some other way */}
        <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-3">
          <h2 className="text-[18px] font-extrabold text-white">Paid some other way?</h2>
          <p className="text-[14px] text-[#A9C4BE] leading-relaxed">
            Cash or a transfer to the lender is fine. Ask them to mark it as paid, or send the code under Pay manually.
          </p>
        </div>

      </div>
    </div>
  );
}