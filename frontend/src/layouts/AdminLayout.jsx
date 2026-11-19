import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react';
import BeeLogo from '../components/BeeLogo';
import { useToast } from '../context/ToastContext';
import { useDeveloperAuth } from '../auth/DeveloperAuthContext';

/**
 * AdminLayout — shell for /admin/* routes.
 *
 * `counts` prop: { requests, payments, support } — the amber badges.
 *   Swap for a useDashboardCounts() hook once the backend is live.
 */
export default function AdminLayout({ counts = {} }) {
  const toast = useToast();
  const navigate = useNavigate();
  const { developer, logout } = useDeveloperAuth();

  const initials =
    (developer?.name || developer?.email || 'AD')
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || 'AD';

  const handleLogout = () => {
    logout?.();
    toast('Signed out.');
    navigate('/admin', { replace: true });
  };

  const items = [
    { to: '/admin/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
    { to: '/admin/requests', label: 'Requests', Icon: ClipboardList, badge: counts.requests },
    { to: '/admin/payments', label: 'Payments', Icon: Wallet, badge: counts.payments },
    { to: '/admin/borrowers', label: 'Borrowers', Icon: Users },
    { to: '/admin/support', label: 'Support', Icon: MessageSquare, badge: counts.support },
    { to: '/admin/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[236px_1fr] min-h-screen bg-[#04120F] text-[#F0FDF4] font-sans">
      {/* ---------------- Sidebar ---------------- */}
      <aside
        aria-label="Admin menu"
        className="bg-[#031A16] border-b md:border-b-0 md:border-r border-white/10 p-2.5 md:p-5 flex md:flex-col flex-row gap-1 md:gap-1 overflow-x-auto"
      >
        <div className="hidden md:flex items-center gap-2.5 px-2 pb-4 font-extrabold text-lg">
          <BeeLogo size={34} />
          <span>Admin</span>
        </div>

        {items.map(({ to, label, Icon, badge, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 min-h-11 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[rgba(0,191,165,0.16)] text-white shadow-[inset_3px_0_0_#00BFA5]'
                  : 'text-[#A9C4BE] hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2.2} className="shrink-0" />
            <span className="hidden md:inline">{label}</span>
            {badge > 0 && (
              <span className="ml-auto bg-[#FFB300] text-[#0F172A] text-[11px] font-extrabold rounded-full px-2 py-0.5 min-w-5 text-center">
                {badge}
              </span>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="md:mt-auto flex items-center gap-2.5 px-3 min-h-11 rounded-xl text-sm font-semibold text-[#A9C4BE] hover:text-white whitespace-nowrap"
        >
          <LogOut size={18} strokeWidth={2.2} className="shrink-0" />
          <span className="hidden md:inline">Lock and exit</span>
        </button>
      </aside>

      {/* ---------------- Main column ---------------- */}
      <div className="px-4 md:px-7 py-6 flex flex-col gap-4 min-w-0">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">BorrowBee Admin</h1>
            <p className="text-[#A9C4BE] text-sm leading-relaxed mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[rgba(0,191,165,0.2)] text-[#7FF0DC] px-2.5 py-1 rounded-full">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
                Live
              </span>
              <span>Signed in as {developer?.email || 'developer'}</span>
            </p>
          </div>

          <div className="flex gap-2.5 items-center">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => toast('No new notifications.')}
              className="relative w-11 h-11 rounded-full border border-white/10 bg-transparent text-[#F0FDF4] grid place-items-center hover:bg-white/5"
            >
              <Bell size={18} strokeWidth={2.2} />
            </button>
            <div
              aria-label={`Signed in as ${developer?.email || 'developer'}`}
              className="w-11 h-11 rounded-full bg-[#FFB300] text-[#0F172A] grid place-items-center font-extrabold text-sm"
            >
              {initials}
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}