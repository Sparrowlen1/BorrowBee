import { Outlet, useLocation } from "react-router-dom";
import PhoneShell from "./PhoneShell";
import TabBar from "./TabBar";

export default function BorrowerLayout() {
  const { pathname } = useLocation();
  const hideTabs =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen py-10 px-4">
      <PhoneShell>
        <Outlet />
        {!hideTabs && <TabBar />}
      </PhoneShell>
    </div>
  );
}