import { createContext, useCallback, useContext, useState } from "react";
import { PASSCODE } from "../utils/constants";

const DeveloperAuthContext = createContext(null);
const SESSION_KEY = "borrowbee.developerAuth";
const DEVELOPER_KEY = "borrowbee.developerInfo";

export function DeveloperAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  // Holds { name, email } of the signed-in developer. Optional — only set
  // when login() is called with the object form. Used by AdminLayout for
  // the avatar initials and "Signed in as ..." line.
  const [developer, setDeveloper] = useState(() => {
    try {
      const raw = sessionStorage.getItem(DEVELOPER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /**
   * login(passcode)                    -> original behaviour, passcode only
   * login({ passcode, email, remember }) -> also stores developer info for display
   *
   * Returns true on success, false on wrong passcode.
   */
  const login = useCallback((payload) => {
    const isObject = typeof payload === "object" && payload !== null;
    const passcode = isObject ? payload.passcode : payload;
    const email = isObject ? payload.email : null;
    const remember = isObject ? payload.remember : false;

    if (passcode === PASSCODE) {
      // Use localStorage if the user ticked "Trust this device"; otherwise
      // session-only (cleared when the tab closes).
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, "1");

      if (email) {
        const info = { email, name: email.split("@")[0] };
        storage.setItem(DEVELOPER_KEY, JSON.stringify(info));
        setDeveloper(info);
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(DEVELOPER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(DEVELOPER_KEY);
    setIsAuthenticated(false);
    setDeveloper(null);
  }, []);

  return (
    <DeveloperAuthContext.Provider
      value={{ isAuthenticated, developer, login, logout }}
    >
      {children}
    </DeveloperAuthContext.Provider>
  );
}

export function useDeveloperAuth() {
  const ctx = useContext(DeveloperAuthContext);
  if (!ctx)
    throw new Error(
      "useDeveloperAuth must be used within DeveloperAuthProvider"
    );
  return ctx;
}