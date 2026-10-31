import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
import { useDeveloperAuth } from "./DeveloperAuthContext";

export default function ProtectedRoute({ role, redirectTo }) {
  const { borrower } = useUserAuth();
  const { isAuthenticated } = useDeveloperAuth();

  const allowed =
    (role === "user" && !!borrower) ||
    (role === "developer" && isAuthenticated);

  if (!allowed) {
    const to = redirectTo || (role === "developer" ? "/admin" : "/login");
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
