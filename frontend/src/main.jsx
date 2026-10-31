import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserAuthProvider } from "./auth/UserAuthContext";
import { DeveloperAuthProvider } from "./auth/DeveloperAuthContext";
import { LoanProvider } from "./context/LoanContext";
import { Toaster } from "sonner"; // <-- Import Sonner
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthProvider>
      <DeveloperAuthProvider>
        <LoanProvider>
          <App />
          <Toaster position="top-center" richColors />
        </LoanProvider>
      </DeveloperAuthProvider>
    </UserAuthProvider>
  </React.StrictMode>
);