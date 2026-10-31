import { useState } from "react";
import { useUserAuth } from "../../auth/UserAuthContext";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function ProfilePage() {
  const { borrower, updateProfile } = useUserAuth();
  
  // State for the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the form inputs inside the modal
  const [form, setForm] = useState({
    name: borrower?.name || "",
    idNumber: borrower?.idNumber || "",
    phone: borrower?.phone || "",
  });

  // Open modal and pre-fill the form with current data
  const handleOpenModal = () => {
    setForm({
      name: borrower?.name || "",
      idNumber: borrower?.idNumber || "",
      phone: borrower?.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.idNumber || !form.phone) {
      return toast.error("Please fill in all fields.");
    }
    
    updateProfile(form);
    setIsModalOpen(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 items-start mt-2 relative">
      
      {/* Profile Info Card (Read Only) */}
      <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-extrabold text-white">Personal details</h2>
          <button 
            onClick={handleOpenModal}
            className="text-[#00BFA5] text-sm font-bold hover:text-white transition-colors"
          >
            Edit details
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-1.5">Full Name</label>
            <div className="w-full h-12 rounded-xl bg-white/5 px-4 flex items-center text-[15px] text-white/90">
              {borrower?.name || "Not provided"}
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-1.5">ID Number</label>
            <div className="w-full h-12 rounded-xl bg-white/5 px-4 flex items-center text-[15px] text-white/90">
              {borrower?.idNumber || "Not provided"}
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-1.5">Mobile Number</label>
            <div className="w-full h-12 rounded-xl bg-white/5 px-4 flex items-center text-[15px] text-white/90">
              {borrower?.phone || "Not provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Account Status Side Card */}
      <div className="bg-[#111A17] border border-white/5 rounded-[24px] p-6 md:p-8 flex flex-col gap-5">
        <h2 className="text-[20px] font-extrabold text-white">Account status</h2>
        
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-[#A9C4BE] text-[15px]">KYC Status</span>
          <span className="text-[12px] font-extrabold px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00BFA5]">Verified</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-[#A9C4BE] text-[15px]">Borrower Level</span>
          <span className="text-white font-extrabold text-[15px]">Trusted</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-[#A9C4BE] text-[15px]">Member Since</span>
          <span className="text-white font-extrabold text-[15px]">Oct 2026</span>
        </div>
        
        <p className="text-[13px] text-[#A9C4BE] leading-relaxed mt-2">
          To change your ID number or legal name, please contact support as additional verification is required.
        </p>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity">
          
          {/* Modal Container */}
          <div className="bg-[#111A17] border border-white/10 rounded-[24px] w-full max-w-[480px] p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-[22px] font-extrabold text-white mb-6">Edit Profile</h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 rounded-xl bg-transparent border border-white/20 px-4 text-white text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-2">ID Number</label>
                <input
                  type="text"
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  className="w-full h-12 rounded-xl bg-transparent border border-white/20 px-4 text-white text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="Your ID number"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-[#A9C4BE] block mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-12 rounded-xl bg-transparent border border-white/20 px-4 text-white text-[15px] focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="07XX XXX XXX"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="submit"
                  className="flex-1 h-[48px] rounded-xl bg-[#FFB300] text-[#004D40] font-extrabold text-[15px] hover:bg-yellow-400 transition-colors shadow-lg shadow-[#FFB300]/20"
                >
                  Save changes
                </button>
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-[48px] rounded-xl border border-white/20 text-white font-extrabold text-[15px] hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
        </div>
      )}
    </div>
  );
}