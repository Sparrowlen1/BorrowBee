// src/pages/users/ApplyPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Upload,
  ShieldCheck,
  User,
  Phone,
  CreditCard,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useLoan } from "../../context/LoanContext";
import { NEW_USER_LIMIT } from "../../utils/constants";

// TODO: replace with useUserAuth() once you wire the user context here
const USER = {
  name: "Amina Wanjiru",
  idNumber: "12345678",
  phone: "0712345678",
};

const LIMIT = NEW_USER_LIMIT ?? 5000;
const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

const clsInput =
  "w-full h-12 rounded-xl border border-white/45 bg-white/5 text-white px-3.5 text-[15px] placeholder:text-[#8DA9A3]";
const clsLabel = "block text-[13px] font-semibold mb-1.5";
const clsBtnPrimary =
  "min-h-12 rounded-2xl bg-[#FFB300] text-[#0F172A] font-extrabold text-[15px] px-5 inline-flex items-center justify-center gap-2 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition";
const clsBtnOutline =
  "min-h-12 rounded-2xl border-2 border-[#00BFA5] text-[#F0FDF4] font-extrabold text-[15px] px-5 inline-flex items-center justify-center gap-2 hover:bg-white/5 disabled:opacity-60 transition";

export default function ApplyPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { create } = useLoan();

  const [amount, setAmount] = useState(LIMIT);
  const [guarantor, setGuarantor] = useState({
    name: "",
    idNumber: "",
    phone: "",
    relationship: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const interest = Math.round(amount * 0.15);
  const total = amount + interest;

  const setG = (key) => (e) =>
    setGuarantor((g) => ({ ...g, [key]: e.target.value }));

  // ---- 1. Download the blank PDF ----
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/BorrowBee-Loan-Agreement.pdf";
    link.download = `BorrowBee-Agreement-Blank.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("Downloaded. Fill, sign, and upload the signed copy.");
  };

  // ---- 2. File picker ----
  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > 3 * 1024 * 1024) {
      setError("The signed file is over 3 MB. Please compress it or re-scan.");
      e.target.value = "";
      return;
    }
    setError("");
    setFile(f);
  };

  // ---- 3. Submit for review ----
  const handleSubmit = async () => {
    if (
      !guarantor.name.trim() ||
      !guarantor.idNumber.trim() ||
      !guarantor.phone.trim()
    ) {
      setError("Add your guarantor's name, ID number and phone.");
      return;
    }
    if (!file) {
      setError("Upload your signed agreement to continue.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await create({
        borrowerName: USER.name,
        idNumber: USER.idNumber,
        phone: USER.phone,
        amount,
        guarantor: {
          name: guarantor.name.trim(),
          idNumber: guarantor.idNumber.trim(),
          phone: guarantor.phone.trim(),
          relationship: guarantor.relationship.trim() || "—",
        },
        agreementUrl: dataUrl,
        agreementUploadedAt: new Date().toISOString(),
      });

      toast("Submitted. The lender has been notified.");
      navigate("/app/waiting", { replace: true });
    } catch (e) {
      setError(e.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold m-0">Apply for a loan</h2>
          <p className="text-[#A9C4BE] text-[13px] leading-relaxed mt-1 m-0">
            Two steps. Your status updates here automatically.
          </p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {["1 Amount", "2 Agreement", "3 Review", "4 Payout"].map((label, i) => (
          <div
            key={label}
            className={`border-t-4 pt-2 text-[13px] font-semibold ${
              i === 0
                ? "border-[#00BFA5] text-white"
                : i === 1
                ? "border-[#FFB300] text-white"
                : "border-white/15 text-[#A9C4BE]"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* ---- Main card ---- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 min-w-0">
          {/* Step 1: Amount */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[17px] font-extrabold m-0">
              How much do you need?
            </h3>
            <div className="text-[40px] font-extrabold leading-none">
              {fmtKES(amount)}
            </div>
            <input
              type="range"
              min={500}
              max={LIMIT}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#00BFA5] h-8"
              aria-label="Loan amount"
            />
            <div className="flex justify-between text-[13px] text-[#A9C4BE]">
              <span>KES 500</span>
              <span>Limit {fmtKES(LIMIT)}</span>
            </div>
            <p className="text-[#A9C4BE] text-[13px] m-0">
              New borrower limit. The lender may raise it after review.
            </p>
          </div>

          {/* Step 2: Guarantor + PDF + upload */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
            <h3 className="text-[17px] font-extrabold m-0">Sign your agreement</h3>

            {/* 1. Guarantor details */}
            <div className="flex flex-col gap-2">
              <p className={clsLabel}>1. Guarantor details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8DA9A3] pointer-events-none"
                  />
                  <input
                    className={`${clsInput} pl-10`}
                    placeholder="Guarantor full name"
                    aria-label="Guarantor full name"
                    value={guarantor.name}
                    onChange={setG("name")}
                  />
                </div>
                <input
                  className={clsInput}
                  placeholder="Guarantor ID number"
                  aria-label="Guarantor ID number"
                  inputMode="numeric"
                  value={guarantor.idNumber}
                  onChange={setG("idNumber")}
                />
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8DA9A3] pointer-events-none"
                  />
                  <input
                    className={`${clsInput} pl-10`}
                    placeholder="Guarantor phone"
                    aria-label="Guarantor phone"
                    inputMode="tel"
                    value={guarantor.phone}
                    onChange={setG("phone")}
                  />
                </div>
                <input
                  className={clsInput}
                  placeholder="Relationship to you (e.g. brother)"
                  aria-label="Relationship to you"
                  value={guarantor.relationship}
                  onChange={setG("relationship")}
                />
              </div>
            </div>

            {/* 2. Download PDF */}
            <div className="flex flex-col gap-2">
              <p className={clsLabel}>2. Download your agreement</p>
              <button
                type="button"
                onClick={handleDownload}
                className={`${clsBtnOutline} self-start`}
              >
                <Download size={16} />
                Download blank agreement (PDF)
              </button>
              <p className="text-[#A9C4BE] text-[13px] m-0">
                Print the PDF, fill in the blank lines with your details and your guarantor's details, then sign it. You, your guarantor, and a witness must sign the last page.
              </p>
            </div>

            {/* 3. Upload */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signedFile" className={clsLabel}>
                3. Upload the signed agreement
              </label>
              <input
                id="signedFile"
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-white/45 bg-white/5 text-white px-3.5 py-2.5 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00BFA5] file:text-[#0F172A]"
              />
              {file && (
                <p className="text-[#7FF0DC] text-xs m-0 flex items-center gap-1.5">
                  <Upload size={12} />
                  {file.name} · {Math.max(1, Math.round(file.size / 1024))} KB
                </p>
              )}
            </div>

            {/* Error + submit */}
            <p
              className="text-[#FCA5A5] text-[13px] font-semibold min-h-[18px] m-0"
              role="alert"
            >
              {error}
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`${clsBtnPrimary} self-start`}
            >
              <ShieldCheck size={16} />
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </div>
        </div>

        {/* ---- Side summary ---- */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
          <h3 className="text-[17px] font-extrabold m-0">Loan summary</h3>
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-[#A9C4BE]">Amount</span>
            <b>{fmtKES(amount)}</b>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-[#A9C4BE]">Interest (15%)</span>
            <b>{fmtKES(interest)}</b>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-[#A9C4BE]">Total to repay</span>
            <b className="text-[#7FF0DC]">{fmtKES(total)}</b>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <span className="text-[#A9C4BE]">Repay within</span>
            <b>30 days</b>
          </div>
          <p className="text-[#A9C4BE] text-[13px] m-0 mt-1">
            No hidden fees. Your payment is detected automatically.
          </p>

          <div className="border-t border-white/10 pt-3 flex flex-col gap-2 text-[13px] text-[#A9C4BE]">
            <p className="m-0 flex items-center gap-1.5">
              <CreditCard size={12} /> 15% flat · 30-day term
            </p>
            <p className="m-0 flex items-center gap-1.5">
              <ShieldCheck size={12} /> Guarantor required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}