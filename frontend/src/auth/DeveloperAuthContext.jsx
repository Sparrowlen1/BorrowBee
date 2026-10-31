import { createContext, useCallback, useContext, useState } from "react";
import { PASSCODE } from "../utils/constants";

const DeveloperAuthContext = createContext(null);
const SESSION_KEY = "borrowbee.developerAuth";

export function DeveloperAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  const login = useCallback((passcode) => {
    if (passcode === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <DeveloperAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </DeveloperAuthContext.Provider>
  );
}

export function useDeveloperAuth() {
  const ctx = useContext(DeveloperAuthContext);
  if (!ctx) throw new Error("useDeveloperAuth must be used within DeveloperAuthProvider");
  return ctx;
}
