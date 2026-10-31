import { X, Bell } from "lucide-react";

export default function NotificationModal({ isOpen, onClose, notifications }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="bg-[#111A17] border border-white/10 rounded-[24px] w-full max-w-[480px] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-[20px] font-extrabold text-white">Notifications</h2>
          <button 
            onClick={onClose} 
            className="text-white/50 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                <Bell size={32} />
              </div>
              <p className="text-[#A9C4BE] font-semibold text-[15px]">No notifications</p>
              <p className="text-[13px] text-white/40">We'll notify you here when something happens.</p>
            </div>
          ) : (
            /* Notification List */
            <div className="flex flex-col gap-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex gap-4 items-start">
                  <div className="flex-none w-2.5 h-2.5 mt-1.5 rounded-full bg-[#00BFA5]" />
                  <div>
                    <h4 className="text-white font-bold text-[15px]">{notif.title}</h4>
                    <p className="text-[#A9C4BE] text-[13px] mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[11px] text-white/40 mt-2 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}