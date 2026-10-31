import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../auth/UserAuthContext";
import { useLoan } from "../context/LoanContext";
import { 
  LayoutDashboard, 
  Plus, 
  RotateCcw, 
  Menu, 
  HelpCircle, 
  User, 
  LogOut, 
  Bell,
  CreditCard // Added the CreditCard icon
} from "lucide-react";
import { toast } from "sonner";
import NotificationModal from "../components/NotificationModal";

export default function UserLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { borrower, signOut } = useUserAuth();
  const { reset } = useLoan();

  // --- NOTIFICATION STATE ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications and handle First-Time Welcome
  useEffect(() => {
    if (!borrower?.idNumber) return;

    const notifKey = `borrowbee_notifs_${borrower.idNumber}`;
    const stored = localStorage.getItem(notifKey);
    let currentNotifs = stored ? JSON.parse(stored) : [];

    // If no notifications exist, this is a first-time login
    if (currentNotifs.length === 0) {
      const welcomeNotif = {
        id: Date.now(),
        title: "Welcome to BorrowBee!",
        message: "Your account has been created successfully. You can now apply for your first loan of up to KES 5,000.",
        time: "Just now",
        unread: true
      };
      currentNotifs = [welcomeNotif];
      localStorage.setItem(notifKey, JSON.stringify(currentNotifs));
    }

    setNotifications(currentNotifs);
  }, [borrower]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleOpenNotifs = () => {
    setIsNotifOpen(true);
    
    // Mark all as read when opened
    if (unreadCount > 0) {
      const updated = notifications.map((n) => ({ ...n, unread: false }));
      setNotifications(updated);
      if (borrower?.idNumber) {
        localStorage.setItem(`borrowbee_notifs_${borrower.idNumber}`, JSON.stringify(updated));
      }
    }
  };

  const handleLogout = () => {
    signOut();
    reset();
    toast.success("Signed out successfully.");
    navigate("/", { replace: true });
  };

  // ✅ ADDED "Pay" TO THE SIDEBAR HERE
  const navItems = [
    { label: "Home", icon: LayoutDashboard, to: "/app" },
    { label: "Apply", icon: Plus, to: "/app/apply" },
    { label: "My loan", icon: RotateCcw, to: "/app/loan" },
    { label: "Pay", icon: CreditCard, to: "/app/pay" },
    { label: "History", icon: Menu, to: "/app/history" },
    { label: "Support", icon: HelpCircle, to: "/app/help" },
    { label: "Profile", icon: User, to: "/app/profile" },
  ];

  const initials = borrower?.name 
    ? borrower.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : "AW";
    
  const firstName = borrower?.name ? borrower.name.split(' ')[0] : "Amina";

  const isApplyPage = pathname === "/app/apply";
  const isMyLoanPage = pathname === "/app/loan";
  const isPayPage = pathname === "/app/pay";
  const isHistoryPage = pathname === "/app/history";
  const isSupportPage = pathname === "/app/help";
  const isProfilePage = pathname === "/app/profile";

  // Don't show the bell on certain pages
  const hideBell = isApplyPage || isHistoryPage || isSupportPage || isProfilePage || isPayPage;

  return (
    <div className="h-screen w-full bg-[#04120F] text-[#F0FDF4] font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[236px] bg-[#031A16] border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-4 md:px-3.5 md:py-6 gap-1 h-auto md:h-full shrink-0">
        <Link to="/" className="hidden md:flex items-center gap-2.5 font-extrabold text-xl mb-6 px-2 text-white">
          <img src="/logob.png" alt="BorrowBee" className="w-8 h-8 rounded-full" />
          BorrowBee
        </Link>
        
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 min-h-[44px] rounded-xl font-semibold text-sm transition-colors whitespace-nowrap ${
                  isActive 
                    ? "bg-[#072A24] text-white shadow-[inset_3px_0_0_#00BFA5]" 
                    : "text-[#A9C4BE] hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 px-3 min-h-[44px] rounded-xl font-semibold text-sm text-[#A9C4BE] hover:text-white hover:bg-white/5 transition-colors mt-auto shrink-0"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto px-6 py-8 md:px-10 md:py-8 flex flex-col gap-6">
        
        {/* Top Bar Header */}
        <header className="flex justify-between items-start flex-wrap gap-4 mb-2 shrink-0">
          <div>
            {isApplyPage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">Apply for a loan</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2">Four quick steps. Your status updates here automatically.</p>
              </>
            ) : isMyLoanPage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">My loan</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2 flex items-center gap-2">
                  Updates here automatically.
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]"></span> Live
                  </span>
                </p>
              </>
            ) : isPayPage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">Pay your loan</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2 flex items-center gap-2">
                  Pay in the portal or send it directly. Your payment is detected automatically.
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]"></span> Live
                  </span>
                </p>
              </>
            ) : isHistoryPage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">History</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2">All your loans and payments in one place.</p>
              </>
            ) : isSupportPage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">Support</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2">We usually reply inside the app. [SUPPORT HOURS]</p>
              </>
            ) : isProfilePage ? (
              <>
                <h1 className="text-[32px] font-extrabold text-white leading-none">Profile</h1>
                <p className="text-[#A9C4BE] text-[15px] mt-2">Manage your personal details.</p>
              </>
            ) : (
              <>
                <h1 className="text-[32px] font-extrabold text-white">Good afternoon, {firstName}</h1>
                <p className="text-[#A9C4BE] text-sm flex items-center gap-2 mt-1">
                  Everything updates here automatically. 
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#00BFA5]/10 text-[#00BFA5] border border-[#00BFA5]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]"></span> Live
                  </span>
                </p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            {/* NOTIFICATION BELL */}
            {!hideBell && (
              <button 
                onClick={handleOpenNotifs}
                className="relative w-[42px] h-[42px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition"
              >
                <Bell size={18} className="text-white/80" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FFB300] border border-[#04120F]"></span>
                )}
              </button>
            )}
            
            <Link 
              to="/app/profile" 
              className="w-[42px] h-[42px] rounded-full bg-[#FFB300] text-[#004D40] flex items-center justify-center font-extrabold text-sm shadow-[0_0_15px_rgba(255,179,0,0.3)] hover:scale-105 transition-transform"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 max-w-[1300px] w-full mx-auto pb-10">
          <Outlet />
        </div>
      </main>

      {/* NOTIFICATION MODAL */}
      <NotificationModal 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
      />
      
    </div>
  );
}