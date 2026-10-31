import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { K } from "../../utils/constants";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'repaid'

  // Mock data matching your screenshot
  const stats = {
    totalBorrowed: 8000,
    totalRepaid: 3450,
    onTime: "1 of 1"
  };

  const loans = [
    {
      id: 1,
      date: "19 Oct 2026",
      amount: 5000,
      interest: 750,
      total: 5750,
      status: "Active",
      action: "View"
    },
    {
      id: 2,
      date: "12 Aug 2026",
      amount: 3000,
      interest: 450,
      total: 3450,
      status: "Repaid on time",
      action: "Agreement"
    }
  ];

  // --- ACTIONS ---

  const handleDownloadStatement = () => {
    // 1. Open a new blank window
    const printWindow = window.open("", "_blank");

    // 2. Write the HTML for the statement
    printWindow.document.write(`
      <html>
        <head>
          <title>BorrowBee Statement</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; align-items: center; gap: 20px; border-bottom: 2px solid #004D40; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { width: 60px; height: 60px; border-radius: 50%; }
            h1 { color: #004D40; margin: 0; font-size: 24px; }
            p.subtitle { margin: 5px 0 0 0; color: #666; font-size: 14px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th { background-color: #f0fdf4; color: #004D40; text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #ddd; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            .status-active { color: #B45309; font-weight: bold; }
            .status-repaid { color: #047857; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}/logob.png" class="logo" alt="BorrowBee Logo" />
            <div>
              <h1>BorrowBee</h1>
              <p class="subtitle">Official Loan Statement</p>
            </div>
          </div>
          
          <div class="meta">
            <div>
              <strong>Borrower:</strong> Amina Wanjiru<br>
              <strong>ID:</strong> 12345678
            </div>
            <div style="text-align: right;">
              <strong>Date Generated:</strong> ${new Date().toLocaleDateString("en-GB")}<br>
              <strong>Statement ID:</strong> #BB-${Math.floor(Math.random() * 90000) + 10000}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Interest</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${loans.map(l => `
                <tr>
                  <td>${l.date}</td>
                  <td>${K(l.amount)}</td>
                  <td>${K(l.interest)}</td>
                  <td>${K(l.total)}</td>
                  <td class="${l.status === 'Active' ? 'status-active' : 'status-repaid'}">${l.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Thank you for choosing BorrowBee.</p>
            <p>This is a system-generated document. No signature is required.</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // 3. Wait a moment for the logo image to load, then open the print dialog
    setTimeout(() => {
      printWindow.print();
      toast.success("Statement ready. Use your browser's print dialog to save as PDF.");
    }, 500);
  };

  const handleDownloadAgreement = (id) => {
    // Generate a mock text file for the agreement
    const textContent = `BORROWBEE LOAN AGREEMENT\n\nLoan ID: ${id}\nGenerated: ${new Date().toLocaleDateString()}\n\nThis is a mock agreement document for demonstration purposes.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `agreement_${id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Agreement downloaded.");
  };

  const handleActionClick = (loan) => {
    if (loan.action === "View") {
      navigate("/app/loan");
    } else if (loan.action === "Agreement") {
      handleDownloadAgreement(loan.id);
    }
  };

  // --- FILTERING ---
  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;
    if (filter === "active") return loan.status === "Active";
    if (filter === "repaid") return loan.status === "Repaid on time";
    return true;
  });

  return (
    <div className="flex flex-col gap-5 mt-2 w-full max-w-[1100px]">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 flex flex-col gap-2">
          <span className="text-[15px] text-[#A9C4BE] font-semibold">Total borrowed</span>
          <div className="text-[36px] font-extrabold text-white leading-none">{K(stats.totalBorrowed)}</div>
        </div>
        
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 flex flex-col gap-2">
          <span className="text-[15px] text-[#A9C4BE] font-semibold">Total repaid</span>
          <div className="text-[36px] font-extrabold text-white leading-none">{K(stats.totalRepaid)}</div>
        </div>
        
        <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 flex flex-col gap-2">
          <span className="text-[15px] text-[#A9C4BE] font-semibold">On-time repayments</span>
          <div className="text-[36px] font-extrabold text-white leading-none">{stats.onTime}</div>
        </div>
      </div>

      {/* Loans Table Section */}
      <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 flex flex-col gap-6">
        
        {/* Table Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-[20px] font-extrabold text-white">Loans</h2>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setFilter("all")}
              className={`h-[38px] px-5 rounded-full font-extrabold text-sm transition-colors ${
                filter === "all" ? "bg-[#00BFA5] text-[#004D40]" : "border border-white/10 text-white hover:bg-white/5"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("active")}
              className={`h-[38px] px-5 rounded-full font-extrabold text-sm transition-colors ${
                filter === "active" ? "bg-[#00BFA5] text-[#004D40]" : "border border-white/10 text-white hover:bg-white/5"
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter("repaid")}
              className={`h-[38px] px-5 rounded-full font-extrabold text-sm transition-colors ${
                filter === "repaid" ? "bg-[#00BFA5] text-[#004D40]" : "border border-white/10 text-white hover:bg-white/5"
              }`}
            >
              Repaid
            </button>
            <button 
              onClick={handleDownloadStatement}
              className="h-[38px] px-5 rounded-full border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-colors ml-2"
            >
              Download statement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-[#A9C4BE] text-[13px] font-semibold">
                <th className="pb-3 px-2 font-medium">Date</th>
                <th className="pb-3 px-2 font-medium">Amount</th>
                <th className="pb-3 px-2 font-medium">Interest</th>
                <th className="pb-3 px-2 font-medium">Total</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th className="pb-3 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-[15px]">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-[#A9C4BE]">
                    No loans found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-2 text-white font-medium">{loan.date}</td>
                    <td className="py-4 px-2 text-white">{K(loan.amount)}</td>
                    <td className="py-4 px-2 text-white">{K(loan.interest)}</td>
                    <td className="py-4 px-2 text-white">{K(loan.total)}</td>
                    <td className="py-4 px-2">
                      {loan.status === "Active" ? (
                        <span className="text-[12px] font-extrabold px-3 py-1 rounded-full bg-[#FFB300] text-[#004D40]">
                          Active
                        </span>
                      ) : (
                        <span className="text-[12px] font-extrabold px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00BFA5]">
                          {loan.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => handleActionClick(loan)}
                        className="text-[#00BFA5] font-bold underline underline-offset-4 hover:text-white transition-colors"
                      >
                        {loan.action}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-[#111A17] border border-white/5 rounded-[20px] p-6 md:p-8 flex flex-col gap-4 mb-10">
        <h2 className="text-[20px] font-extrabold text-white mb-2">Payments</h2>
        
        <div className="flex gap-3 items-start">
          <div className="flex-none w-3.5 h-4 mt-1 bg-[#00BFA5]" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}></div>
          <div>
            <b className="block font-bold text-white text-[16px]">KES 3,450 received</b>
            <span className="text-[14px] text-[#A9C4BE]">8 Sep 2026 · detected automatically</span>
          </div>
        </div>
      </div>

    </div>
  );
}