import { Link } from "react-router-dom";

export default function AboutPage() {
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
          <Link to="/about" className="px-4 py-2 bg-white/10 rounded-lg text-brand-accent">About Us</Link>
        </nav>
        <Link to="/" className="bg-brand-accent text-brand-ink px-5 py-2.5 rounded-xl font-extrabold text-sm hover:scale-105 transition">
          Back to App
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-[800px] mx-auto px-8 py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">About BorrowBee</h1>
        <div className="space-y-6 text-[#B7CFC9] leading-relaxed text-lg">
          <p>
            BorrowBee was founded with a single mission: to make financial freedom accessible to every Kenyan. Traditional banking often leaves hardworking individuals behind due to complex paperwork, long waiting times, and hidden fees.
          </p>
          <p>
            We believe that accessing a micro-loan should be as simple as sending a text message. By leveraging modern technology and mobile money integrations, we provide instant, transparent, and fair loans directly to your phone.
          </p>
          
          <h2 className="text-2xl font-bold text-white mt-12 mb-4">Our Promise</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong className="text-white">Transparency:</strong> No hidden charges. You see exactly what you will repay before you apply.</li>
            <li><strong className="text-white">Speed:</strong> A 30-minute approval process because we know emergencies don't wait.</li>
            <li><strong className="text-white">Security:</strong> Your data is encrypted and protected using bank-grade security protocols.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}