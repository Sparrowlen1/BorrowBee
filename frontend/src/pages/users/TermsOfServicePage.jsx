import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#04120F] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute right-[-80px] top-[-60px] w-[680px] h-[680px] bg-[radial-gradient(circle_at_40%_40%,rgba(0,191,165,0.45),transparent_60%)] blur-[30px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap justify-between items-center px-8 py-5 max-w-[1180px] mx-auto w-full border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold hover:opacity-80 transition">
          <img src="/logob.png" alt="BorrowBee" className="w-9 h-9 rounded-full" />
          BorrowBee
        </Link>
        <nav className="hidden md:flex gap-1 bg-white/5 p-1.5 rounded-xl text-sm font-semibold">
          <Link to="/" className="px-4 py-2 hover:bg-white/10 rounded-lg transition">Home</Link>
          <Link to="/terms" className="px-4 py-2 bg-white/10 rounded-lg text-brand-accent">Terms</Link>
        </nav>
        <Link to="/" className="bg-brand-accent text-brand-ink px-5 py-2.5 rounded-xl font-extrabold text-sm hover:scale-105 transition">
          Back to App
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-[800px] mx-auto px-8 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-sm text-white/50 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-[#B7CFC9] leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">1. Eligibility</h2>
            <p>You must be a Kenyan citizen, at least 18 years old, and possess a valid National ID to use BorrowBee services.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">2. Loan Terms</h2>
            <p>New borrowers are eligible for a maximum limit of KES 5,000. The standard loan term is 30 days with a flat interest rate of 15%. The total amount due will be clearly displayed before you sign the agreement.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">3. Guarantor Requirement</h2>
            <p>All loans require a guarantor. By providing a guarantor, you confirm that they have consented to act as a backup for your loan repayment.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">4. Late Payments</h2>
            <p>If you fail to repay the loan within 30 days, we will send automated reminders. Continued failure to pay may result in your details being shared with licensed credit reference bureaus (CRB), which could affect your future borrowing ability.</p>
          </div>
        </div>
      </main>
    </div>
  );
}