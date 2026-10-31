import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./layouts/UserLayout"; 
import ProtectedRoute from "./auth/ProtectedRoute";

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

export default function App() {
  return (
    <BrowserRouter>
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

        {/* Developer Routes */}
        <Route path="/admin" element={<DeveloperLoginPage />} />
        <Route element={<ProtectedRoute role="developer" />}>
          <Route path="/admin/dashboard" element={<DeveloperDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}