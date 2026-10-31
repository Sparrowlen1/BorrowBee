import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../auth/UserAuthContext";
import { useLoan } from "../context/LoanContext";
import { Home, History, HelpCircle, LogOut } from "lucide-react";

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useUserAuth();
  const { reset } = useLoan();

  const active =
    pathname === "/app/history" ? "history" : pathname === "/app/help" ? "help" : "home";

  const tabs = [
    { id: "home", label: "Home", icon: Home, to: "/app" },
    { id: "history", label: "History", icon: History, to: "/app/history" },
    { id: "help", label: "Help", icon: HelpCircle, to: "/app/help" },
  ];

  function handleLogout() {
    signOut();   // clears borrower from UserAuthContext
    reset();     // clears active loan from LoanContext
    navigate("/", { replace: true }); // back to landing page
  }

  return (
    <nav className="flex border-t border-white/15 bg-[#04120F]">
      {tabs.map(({ id, label, icon: Icon, to }) => (
        <button
          key={id}
          onClick={() => navigate(to)}
          aria-current={active === id}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold min-h-[56px] transition-colors ${
            active === id
              ? "text-brand-secondary shadow-[inset_0_3px_0_#00BFA5] font-extrabold"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold min-h-[56px] text-white/60 hover:text-red-400 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </nav>
  );
}