export const INTEREST_RATE = 0.15;
export const LOAN_TERM_DAYS = 30;
export const MIN_AMOUNT = 500;
export const NEW_USER_LIMIT = 5000;
export const PASSCODE = "admin123";

export const STATUS = {
  NONE: "none",
  PENDING: "pending",
  APPROVED: "approved",
  ACTIVE: "active",
  REPAID: "repaid",
  DECLINED: "declined",
};

// This is the missing function that formats numbers like 5000 -> KES 5,000
export const K = (n) => `KES ${Number(n || 0).toLocaleString("en-US")}`;

// Calculates the total to repay including 15% interest
export const total = (amt) => Math.round(amt * (1 + INTEREST_RATE));