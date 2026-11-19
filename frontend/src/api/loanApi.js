// src/api/loanApi.js
//
// Two modes:
//   USE_MOCK = true   -> everything resolves from localStorage (no backend needed)
//   USE_MOCK = false  -> real fetch to /api/* (Vite proxy -> :4000)
//
// Flip the flag when the backend is live. All callers stay identical.

import { STATUS } from "../utils/constants";

const USE_MOCK = true;          // <-- flip to false when backend is ready
const BASE = "/api";

// ============================================================
// MOCK
// ============================================================
const MOCK_DELAY = 220;                                       // ms, simulates latency
const MOCK_KEY = "borrowbee.mockLoans";                       // localStorage bucket
const INTEREST = 0.15;
const LOAN_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// Fallbacks in case a status name isn't in constants.js yet.
const S = {
  PENDING:   STATUS.PENDING   ?? "PENDING",
  APPROVED:  STATUS.APPROVED  ?? "APPROVED",
  DECLINED:  STATUS.DECLINED  ?? "DECLINED",
  DISBURSED: STATUS.DISBURSED ?? "DISBURSED",
  REPAID:    STATUS.REPAID    ?? "REPAID",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uid = () =>
  "BB-" + Math.random().toString(36).slice(2, 9).toUpperCase();

const readMock = () => {
  try {
    return JSON.parse(localStorage.getItem(MOCK_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeMock = (loans) => {
  localStorage.setItem(MOCK_KEY, JSON.stringify(loans));
};

const withTotals = (loan) => {
  const amount = Number(loan.amount) || 0;
  return {
    ...loan,
    interest: Math.round(amount * INTEREST),
    totalDue: Math.round(amount * (1 + INTEREST)),
  };
};

// Seed on first run so the dashboard has something to look at.
const seedIfEmpty = () => {
  if (readMock().length) return;
  const now = Date.now();

  const seeds = [
    {
      id: "BB-SEED001",
      borrowerName: "Amina Wanjiru",
      idNumber: "12345678",
      phone: "0712345678",
      amount: 5000,
      status: S.PENDING,
      guarantor: {
        name: "James Mwangi",
        phone: "0722111222",
        idNumber: "87654321",
        relationship: "Brother",
      },
      agreementUrl: "#",
      createdAt: new Date(now - 8 * 60 * 1000).toISOString(), // 8 min ago
    },
    {
      id: "BB-SEED002",
      borrowerName: "Brian Otieno",
      idNumber: "23456789",
      phone: "0723456789",
      amount: 5000,
      status: S.APPROVED,
      guarantor: {
        name: "Mary Achieng",
        phone: "0733111222",
        idNumber: "87654322",
        relationship: "Sister",
      },
      agreementUrl: "#",
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      approvedAt: new Date(now - 20 * 60 * 1000).toISOString(),
    },
    {
      id: "BB-SEED003",
      borrowerName: "Grace Mwangi",
      idNumber: "24681357",
      phone: "0734567890",
      amount: 5000,
      status: S.DISBURSED,
      guarantor: {
        name: "Peter Njoroge",
        phone: "0744111222",
        idNumber: "87654323",
        relationship: "Friend",
      },
      agreementUrl: "#",
      createdAt: new Date(now - 5 * DAY_MS).toISOString(),
      approvedAt: new Date(now - 5 * DAY_MS + 10 * 60 * 1000).toISOString(),
      disbursedAt: new Date(now - 5 * DAY_MS + 15 * 60 * 1000).toISOString(),
      dueDate: new Date(now - 5 * DAY_MS + 15 * 60 * 1000 + LOAN_DAYS * DAY_MS).toISOString(),
      payoutPhone: "0734567890",
    },
  ];

  writeMock(seeds.map(withTotals));
};

const mock = {
  health: async () => {
    await sleep(MOCK_DELAY);
    return { ok: true, mode: "mock" };
  },

  listLoans: async () => {
    await sleep(MOCK_DELAY);
    return readMock();
  },

  getLoan: async (id) => {
    await sleep(MOCK_DELAY);
    const found = readMock().find((l) => l.id === id);
    if (!found) throw new Error("Loan not found");
    return found;
  },

  createLoan: async (payload) => {
    await sleep(MOCK_DELAY);
    const created = withTotals({
      id: uid(),
      status: S.PENDING,
      createdAt: new Date().toISOString(),
      ...payload,                       // preserves whatever ApplyPage sends
    });
    writeMock([created, ...readMock()]);
    return created;
  },

  // ---- UPDATED: accepts optional { amount } to override the approved amount
  approve: async (id, options = {}) => {
    await sleep(MOCK_DELAY);
    const all = readMock();
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) throw new Error("Loan not found");
    const override =
      options.amount && Number(options.amount) > 0
        ? Number(options.amount)
        : null;
    all[i] = withTotals({
      ...all[i],
      status: S.APPROVED,
      amount: override ?? all[i].amount,
      approvedAmount: override ?? all[i].amount,
      approvedAt: new Date().toISOString(),
    });
    writeMock(all);
    return all[i];
  },

  // ---- UPDATED: accepts optional { reason } for the borrower-visible note
  decline: async (id, options = {}) => {
    await sleep(MOCK_DELAY);
    const all = readMock();
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) throw new Error("Loan not found");
    all[i] = withTotals({
      ...all[i],
      status: S.DECLINED,
      declinedAt: new Date().toISOString(),
      declineReason: options.reason || null,
    });
    writeMock(all);
    return all[i];
  },

  disburse: async (id, phone) => {
    await sleep(MOCK_DELAY);
    const all = readMock();
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) throw new Error("Loan not found");
    const now = Date.now();
    all[i] = withTotals({
      ...all[i],
      status: S.DISBURSED,
      disbursedAt: new Date(now).toISOString(),
      dueDate: new Date(now + LOAN_DAYS * DAY_MS).toISOString(),
      payoutPhone: phone,
    });
    writeMock(all);
    return all[i];
  },

  repay: async (id) => {
    await sleep(MOCK_DELAY);
    const all = readMock();
    const i = all.findIndex((l) => l.id === id);
    if (i < 0) throw new Error("Loan not found");
    all[i] = withTotals({
      ...all[i],
      status: S.REPAID,
      repaidAt: new Date().toISOString(),
    });
    writeMock(all);
    return all[i];
  },
};

// ============================================================
// REAL (unchanged — backend will read { amount } / { reason } from body)
// ============================================================
async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

const real = {
  health: () => request("/health"),
  listLoans: () => request("/loans"),
  getLoan: (id) => request(`/loans/${id}`),
  createLoan: (payload) =>
    request("/loans", { method: "POST", body: JSON.stringify(payload) }),
  approve: (id, options = {}) =>
    request(`/loans/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ amount: options.amount ?? null }),
    }),
  decline: (id, options = {}) =>
    request(`/loans/${id}/decline`, {
      method: "POST",
      body: JSON.stringify({ reason: options.reason ?? null }),
    }),
  disburse: (id, phone) =>
    request(`/loans/${id}/disburse`, {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  repay: (id) => request(`/loans/${id}/repay`, { method: "POST" }),
};

// Seed once on module load when in mock mode
if (USE_MOCK) seedIfEmpty();

export const loanApi = USE_MOCK ? mock : real;

// Dev helper — clear mock data from the browser console:
//   window.borrowbeeResetLoans()
if (typeof window !== "undefined" && USE_MOCK) {
  window.borrowbeeResetLoans = () => {
    localStorage.removeItem(MOCK_KEY);
    localStorage.removeItem("borrowbee.loanId");
    window.location.reload();
  };
}