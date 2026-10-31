const BASE = "/api";

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const loanApi = {
  health: () => request("/health"),
  listLoans: () => request("/loans"),
  getLoan: (id) => request(`/loans/${id}`),
  createLoan: (payload) =>
    request("/loans", { method: "POST", body: JSON.stringify(payload) }),
  approve: (id) => request(`/loans/${id}/approve`, { method: "POST" }),
  decline: (id) => request(`/loans/${id}/decline`, { method: "POST" }),
  disburse: (id, phone) =>
    request(`/loans/${id}/disburse`, {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  repay: (id) => request(`/loans/${id}/repay`, { method: "POST" }),
};
