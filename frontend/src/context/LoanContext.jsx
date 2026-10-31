import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loanApi } from "../api/loanApi";
import { STATUS, NEW_USER_LIMIT } from "../utils/constants";

const LoanContext = createContext(null);
const LS_KEY = "borrowbee.loanId";

export function LoanProvider({ children }) {
  const [loan, setLoan] = useState(null);
  const [limit, setLimit] = useState(NEW_USER_LIMIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem(LS_KEY);
    if (!id) return;
    loanApi.getLoan(id).then(setLoan).catch(() => localStorage.removeItem(LS_KEY));
  }, []);

  useEffect(() => {
    if (!loan || loan.status !== STATUS.PENDING) return;
    const t = setInterval(async () => {
      try { setLoan(await loanApi.getLoan(loan.id)); } catch {}
    }, 5000);
    return () => clearInterval(t);
  }, [loan?.id, loan?.status]);

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    try {
      const created = await loanApi.createLoan(payload);
      localStorage.setItem(LS_KEY, created.id);
      setLoan(created);
      return created;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const disburse = useCallback(async (phone) => {
    const updated = await loanApi.disburse(loan.id, phone);
    setLoan(updated);
    return updated;
  }, [loan]);

  const repay = useCallback(async () => {
    const updated = await loanApi.repay(loan.id);
    setLoan(updated);
    localStorage.removeItem(LS_KEY);
    return updated;
  }, [loan]);

  const reset = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setLoan(null);
  }, []);

  return (
    <LoanContext.Provider value={{ loan, limit, setLimit, loading, error, create, disburse, repay, reset }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error("useLoan must be used within LoanProvider");
  return ctx;
}
