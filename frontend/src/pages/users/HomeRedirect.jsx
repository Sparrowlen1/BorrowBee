import { Navigate } from "react-router-dom";
import { useLoan } from "../../context/LoanContext";
import { STATUS } from "../../utils/constants";
import ActiveLoanPage from "./ActiveLoanPage";

export default function HomeRedirect() {
  const { loan } = useLoan();

  // Only redirect if there's a specific action the user needs to take
  if (loan?.status === STATUS.PENDING) return <Navigate to="/app/waiting" replace />;
  if (loan?.status === STATUS.APPROVED) return <Navigate to="/app/payout" replace />;
  
  // Otherwise, render the Dashboard Home (which handles both active loans and empty states)
  return <ActiveLoanPage />;
}