import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";

// User Pages
import LandingPage from "./pages/users/LandingPage";
import LoginPage from "./pages/users/LoginPage";
import RegisterPage from "./pages/users/RegisterPage";
import HomeRedirect from "./pages/users/HomeRedirect";
import ApplyPage from "./pages/users/ApplyPage";
import AgreementPage from "./pages/users/AgreementPage";
import WaitingPage from "./pages/users/WaitingPage";
import PayoutPage from "./pages/users/PayoutPage";
import HistoryPage from "./pages/users/HistoryPage";
import HelpPage from "./pages/users/HelpPage";
import MyLoanPage from "./pages/users/MyLoanPage";
import ProfilePage from "./pages/users/ProfilePage";
import PayLoanPage from "./pages/users/PayLoanPage";

// Company Pages
import AboutPage from "./pages/users/AboutPage";
import PrivacyPolicyPage from "./pages/users/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/users/TermsOfServicePage";

// Developer Pages
import DeveloperLoginPage from "./pages/developers/DeveloperLoginPage";
import DeveloperDashboardPage from "./pages/developers/DeveloperDashboardPage";
import DeveloperRequestsPage from "./pages/developers/DeveloperRequestsPage";
import AdminLayout from "./layouts/AdminLayout";

// Developer sub-pages (uncomment as each is built — Options 3–7)
// import DeveloperPaymentsPage  from "./pages/developers/DeveloperPaymentsPage";
// import DeveloperBorrowersPage from "./pages/developers/DeveloperBorrowersPage";
// import DeveloperSupportPage   from "./pages/developers/DeveloperSupportPage";
// import DeveloperSettingsPage  from "./pages/developers/DeveloperSettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* Auth Pages (No Sidebar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User App (With Sidebar) */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route element={<UserLayout />}>
              {/* /app renders ActiveLoanPage via HomeRedirect */}
              <Route path="/app" element={<HomeRedirect />} />

              <Route path="/app/apply" element={<ApplyPage />} />
              <Route path="/app/agreement" element={<AgreementPage />} />
              <Route path="/app/waiting" element={<WaitingPage />} />
              <Route path="/app/payout" element={<PayoutPage />} />

              {/* These now match the sidebar links */}
              <Route path="/app/loan" element={<MyLoanPage />} />
              <Route path="/app/pay" element={<PayLoanPage />} />

              <Route path="/app/history" element={<HistoryPage />} />
              <Route path="/app/help" element={<HelpPage />} />
              <Route path="/app/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ============ Developer Routes ============ */}
          {/* Login — /admin */}
          <Route path="/admin" element={<DeveloperLoginPage />} />

          {/* Protected admin shell (sidebar + topbar + Outlet) */}
          <Route element={<ProtectedRoute role="developer" />}>
            <Route
              element={
                // TODO: replace mock counts with a useDashboardCounts() hook
                // (GET /stats/sidebar-counts) once the backend is live.
                <AdminLayout counts={{ requests: 3, payments: 2, support: 2 }} />
              }
            >
              <Route path="/admin/dashboard" element={<DeveloperDashboardPage />} />
              <Route path="/admin/requests" element={<DeveloperRequestsPage />} />

              {/* Options 3–7 — uncomment as each page is built */}
              {/* <Route path="/admin/payments"  element={<DeveloperPaymentsPage />} /> */}
              {/* <Route path="/admin/borrowers" element={<DeveloperBorrowersPage />} /> */}
              {/* <Route path="/admin/support"   element={<DeveloperSupportPage />} /> */}
              {/* <Route path="/admin/settings"  element={<DeveloperSettingsPage />} /> */}
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}