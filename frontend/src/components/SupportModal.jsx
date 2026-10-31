import { useState } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";

export default function SupportModal({ isOpen, onClose, contextInfo }) {
  const [topic, setTopic] = useState("My loan");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return toast.error("Please enter a message before sending.");
    }

    setIsSending(true);

    // Simulate sending to the developer/lender
    setTimeout(() => {
      // In a real app, this would be an API call like:
      // await loanApi.sendSupportMessage({ topic, message, context: contextInfo });
      
      console.log("Message sent to developer:", { topic, message, contextInfo });
      
      toast.success("Message sent to support successfully!");
      setMessage("");
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      
      <div className="bg-[#111A17] border border-white/10 rounded-[24px] w-full max-w-[480px] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-[22px] font-extrabold text-white mb-1">Message Support</h2>
        <p className="text-[13px] text-[#A9C4BE] mb-6">
          We'll get back to you shortly.
        </p>

        {contextInfo && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-5 flex justify-between items-center">
            <span className="text-[13px] text-[#A9C4BE]">Regarding:</span>
            <span className="text-[13px] font-bold text-white">{contextInfo}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div>
            <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-2">Topic</label>
            <div className="relative">
              <select 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-12 bg-transparent border border-white/20 rounded-xl px-4 text-white text-[15px] appearance-none focus:outline-none focus:border-brand-accent transition-colors cursor-pointer"
              >
                <option className="bg-[#111A17]" value="My loan">My loan</option>
                <option className="bg-[#111A17]" value="Payment issue">Payment issue</option>
                <option className="bg-[#111A17]" value="Guarantor">Guarantor</option>
                <option className="bg-[#111A17]" value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-white/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-2">Your message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us how we can help..."
              className="w-full h-[120px] bg-transparent border border-white/20 rounded-xl p-4 text-white placeholder-white/30 text-[15px] resize-none focus:outline-none focus:border-brand-accent transition-colors"
            ></textarea>
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="submit"
              disabled={isSending}
              className="flex-1 h-[48px] flex items-center justify-center gap-2 rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors disabled:opacity-70"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}