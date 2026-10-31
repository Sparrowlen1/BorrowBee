import { toast } from "sonner";

export default function HelpPage() {
  const faqs = [
    { q: "How much can I borrow?", a: "New borrowers can borrow up to KES 5,000. Repaying on time helps you qualify for more." },
    { q: "How much interest do I pay?", a: "A flat 15% for the 30-day loan period. The total is shown before you apply." },
    { q: "How long does approval take?", a: "Once you submit your agreement, the lender usually reviews and approves it within 30 minutes." },
    { q: "How do I pay?", a: "Use Pay now on My loan. Your payment is detected automatically, and the lender can also record it manually." },
    { q: "What if I cannot pay on time?", a: "You will get reminders before and after the due date. Message support if you need to talk about your options." },
    { q: "Why do I need a guarantor?", a: "A guarantor confirms they will support you if you cannot repay." }
  ];

  return (
    <div className="flex flex-col gap-5 mt-2 w-full max-w-[1100px]">
      
      {/* Top Grid: Form & Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        
        {/* Message Support Form */}
        <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-5">
          <h2 className="text-[20px] font-extrabold text-white">Message support</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-white">Topic</label>
            <div className="relative">
              <select className="w-full h-12 bg-transparent border border-white/20 rounded-xl px-4 text-white text-[15px] appearance-none focus:outline-none focus:border-brand-accent transition-colors cursor-pointer">
                <option className="bg-[#111A17] text-white" value="my-loan">My loan</option>
                <option className="bg-[#111A17] text-white" value="payment-issue">Payment issue</option>
                <option className="bg-[#111A17] text-white" value="account">Account & Profile</option>
                <option className="bg-[#111A17] text-white" value="other">Other</option>
              </select>
              {/* Custom chevron for select */}
              <div className="absolute right-4 top-3.5 pointer-events-none text-white/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-white">Your message</label>
            <textarea 
              className="w-full h-[140px] bg-transparent border border-white/20 rounded-xl p-4 text-white placeholder-white/30 text-[15px] resize-none focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="Tell us what happened"
            ></textarea>
          </div>

          <button 
            onClick={() => toast.success("Message sent to support.")}
            className="h-[48px] px-6 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors w-fit mt-2"
          >
            Send message
          </button>
        </div>

        {/* Right Side Cards */}
        <div className="flex flex-col gap-5">
          
          {/* Other ways to reach us */}
          <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-4">
            <h2 className="text-[20px] font-extrabold text-white mb-1">Other ways to reach us</h2>
            
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#A9C4BE]">Call</span>
              <b className="text-white font-extrabold text-[14px]">0703950378</b>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#A9C4BE]">WhatsApp</span>
              <b className="text-white font-extrabold text-[14px]">0703950378</b>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#A9C4BE]">Email</span>
              <b className="text-white font-extrabold text-[14px]">sparrowlen13@gmail.com</b>
            </div>
          </div>

          {/* Your messages */}
          <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-4">
            <h2 className="text-[20px] font-extrabold text-white mb-1">Your messages</h2>
            
            <div className="flex gap-3 items-start">
              <div className="flex-none w-3 h-3.5 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
              <div>
                <b className="block font-bold text-white text-[15px]">Payment not showing</b>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[13px] text-[#A9C4BE]">8 Sep ·</span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#00BFA5]">Resolved</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Common Questions FAQ */}
      <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col mb-10">
        <h2 className="text-[20px] font-extrabold text-white mb-4">Common questions</h2>
        
        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <details key={index} className="group border-b border-white/10 last:border-0 py-4 cursor-pointer">
              <summary className="font-bold text-white text-[16px] flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="text-white/50 group-open:rotate-180 transition-transform duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </span>
              </summary>
              <p className="text-[#A9C4BE] text-[15px] mt-3 leading-relaxed pr-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}