import { createContext, useCallback, useContext, useState } from "react";

const UserAuthContext = createContext(null);
const LS_KEY = "borrowbee.borrower";

export function UserAuthProvider({ children }) {
  const [borrower, setBorrower] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const signIn = useCallback((b) => {
    localStorage.setItem(LS_KEY, JSON.stringify(b));
    setBorrower(b);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setBorrower(null);
  }, []);

  // NEW: Function to update user details
  const updateProfile = useCallback((newData) => {
    setBorrower((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <UserAuthContext.Provider value={{ borrower, signIn, signOut, updateProfile }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}