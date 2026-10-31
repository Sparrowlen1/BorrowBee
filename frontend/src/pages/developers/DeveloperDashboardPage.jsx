import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeveloperAuth } from "../../auth/DeveloperAuthContext";
import { loanApi } from "../../api/loanApi";
import { toast } from "sonner";
import StatsCards from "../../components/StatsCards";
import ApprovalQueue from "../../components/ApprovalQueue";
import RepaymentsTable from "../../components/RepaymentsTable";
import GrowthChart from "../../components/GrowthChart";

export default function DeveloperDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useDeveloperAuth();
  const [loans, setLoans] = useState([]);

  async function refresh() {
    try {
      setLoans(await loanApi.listLoans());
    } catch (e) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
  }, []);

  function lockAndExit() {
    logout();
    navigate("/admin", { replace: true });
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-brand-secondary m-0">
          Lender dashboard
        </h1>
        <button onClick={lockAndExit} className="px-3 py-2 rounded-lg border border-brand-secondary text-brand-secondary font-extrabold text-sm">
          Lock and exit
        </button>
      </div>
      <StatsCards loans={loans} />
      <GrowthChart />
      <ApprovalQueue
        loans={loans}
        onApprove={async (id) => { await loanApi.approve(id); toast.success("Approved."); refresh(); }}
        onDecline={async (id) => { await loanApi.decline(id); toast.error("Declined."); refresh(); }}
      />
      <RepaymentsTable
        loans={loans}
        onRemind={() => toast.info("Reminder sent (mock).")}
        onMarkPaid={async (id) => { await loanApi.repay(id); toast.success("Marked as paid."); refresh(); }}
      />
    </div>
  );
}
