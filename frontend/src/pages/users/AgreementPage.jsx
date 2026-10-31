import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../auth/UserAuthContext";
import { useLoan } from "../../context/LoanContext";
import { toast } from "sonner";
import { K, INTEREST_RATE } from "../../utils/constants";
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react";

export default function AgreementPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { borrower } = useUserAuth();
  const { create, loading } = useLoan();
  
  const amount = state?.amount ?? 5000;
  const interest = Math.round(amount * INTEREST_RATE);
  const total = amount + interest;

  const [guarantor, setGuarantor] = useState({ 
    name: "", 
    id: "", 
    phone: "",
    relationship: "Family" 
  });
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!guarantor.name || !guarantor.id || !guarantor.phone) {
      return setErr("Please fill in all guarantor details.");
    }
    if (!file) {
      return setErr("Please upload your signed agreement form.");
    }
    if (!agree) {
      return setErr("You must agree to the terms to continue.");
    }
    
    setErr("");
    try {
      await create({ 
        idNumber: borrower?.idNumber || "00000000", 
        name: borrower?.name || "Borrower", 
        amount, 
        phone: "", 
        guarantor 
      });
      toast.success("Agreement submitted. The lender has been notified.");
      navigate("/app/waiting");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="w-full max-w-[1100px] mt-2 pb-10">
      
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        
        {/* Left Column: Guarantor Form & Upload */}
        <div className="flex flex-col gap-5">
          
          {/* Guarantor Details Card */}
          <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-5">
            <div>
              <h2 className="text-[20px] font-extrabold text-white mb-1">Guarantor details</h2>
              <p className="text-[14px] text-[#A9C4BE]">Provide a guarantor who can vouch for this loan.</p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div>
                <label className="text-[14px] font-semibold text-white block mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Paul Mwangi"
                  value={guarantor.name}
                  onChange={(e) => setGuarantor({ ...guarantor, name: e.target.value })}
                  className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-white block mb-2">ID Number</label>
                <input
                  type="text"
                  placeholder="e.g. 87654321"
                  inputMode="numeric"
                  value={guarantor.id}
                  onChange={(e) => setGuarantor({ ...guarantor, id: e.target.value })}
                  className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-semibold text-white block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="07XX XXX XXX"
                    inputMode="tel"
                    value={guarantor.phone}
                    onChange={(e) => setGuarantor({ ...guarantor, phone: e.target.value })}
                    className="w-full h-12 rounded-xl border border-white/20 bg-transparent px-4 text-white placeholder-white/30 text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-white block mb-2">Relationship</label>
                  <div className="relative">
                    <select
                      value={guarantor.relationship}
                      onChange={(e) => setGuarantor({ ...guarantor, relationship: e.target.value })}
                      className="w-full h-12 bg-transparent border border-white/20 rounded-xl px-4 text-white text-[15px] appearance-none focus:outline-none focus:border-brand-accent cursor-pointer"
                    >
                      <option className="bg-[#111A17]" value="Family">Family</option>
                      <option className="bg-[#111A17]" value="Friend">Friend</option>
                      <option className="bg-[#111A17]" value="Colleague">Colleague</option>
                      <option className="bg-[#111A17]" value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-white/50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-5">
            <div>
              <h2 className="text-[20px] font-extrabold text-white mb-1">Signed agreement</h2>
              <p className="text-[14px] text-[#A9C4BE]">Download the template, fill it in, and upload the signed PDF.</p>
            </div>

            <button 
              type="button"
              onClick={() => toast.info("Agreement template downloading...")} 
              className="h-[46px] w-fit px-5 rounded-xl border border-[#00BFA5]/40 text-white font-bold text-[14px] flex items-center gap-2 hover:bg-[#00BFA5]/10 transition-colors"
            >
              <FileText size={18} />
              Download blank template (PDF)
            </button>

            <label className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors mt-2">
              <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 text-[#00BFA5] flex items-center justify-center">
                <UploadCloud size={24} />
              </div>
              <div className="text-center">
                <span className="text-white font-bold text-[15px] block">
                  {file ? file.name : "Click to upload signed document"}
                </span>
                <span className="text-[#A9C4BE] text-[13px] block mt-1">
                  PDF, JPG, or PNG (Max 5MB)
                </span>
              </div>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])} 
                className="hidden" 
              />
            </label>
          </div>

        </div>

        {/* Right Column: Loan Summary & Submit */}
        <div className="flex flex-col gap-5">
          
          {/* Summary Card */}
          <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-4">
            <h2 className="text-[18px] font-extrabold text-white mb-2">Loan summary</h2>
            
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
              <b className="text-[#00BFA5] font-extrabold text-[18px]">{K(total)}</b>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#A9C4BE]">Repay within</span>
              <b className="text-white font-extrabold">30 days</b>
            </div>
            
            <div className="h-px w-full bg-white/10 my-2" />
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-5 h-5 accent-[#00BFA5] mt-0.5 rounded" 
              />
              <span className="text-[13px] text-[#A9C4BE] leading-relaxed">
                I confirm the details provided are correct and I agree to the 15% flat interest terms.
              </span>
            </label>

            {err && <p className="text-red-400 text-sm font-semibold mt-2">{err}</p>}

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-4 h-[52px] w-full rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              {loading ? "Submitting..." : "Submit for review"}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}