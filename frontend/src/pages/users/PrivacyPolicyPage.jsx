import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
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
          <Link to="/privacy" className="px-4 py-2 bg-white/10 rounded-lg text-brand-accent">Privacy</Link>
        </nav>
        <Link to="/" className="bg-brand-accent text-brand-ink px-5 py-2.5 rounded-xl font-extrabold text-sm hover:scale-105 transition">
          Back to App
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-[800px] mx-auto px-8 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/50 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-[#B7CFC9] leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>To provide our services, we collect personal information such as your name, National ID number, phone number, and M-Pesa transaction history. We may also collect device information and location data to prevent fraud.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is used strictly to evaluate your loan application, disburse funds, collect repayments, and comply with Kenyan financial regulations. We do not sell your personal data to third parties.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">3. Data Security</h2>
            <p>We use industry-standard encryption and strict access controls to protect your data. Our systems are regularly audited to ensure your information is safe from unauthorized access.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">4. Your Rights</h2>
            <p>Under the Kenya Data Protection Act (2019), you have the right to access, correct, or request deletion of your personal data. You can contact our support team to exercise these rights.</p>
          </div>
        </div>
      </main>
    </div>
  );
}