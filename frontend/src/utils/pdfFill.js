// src/utils/pdfFill.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TEMPLATE_URL = "/BorrowBee-Loan-Agreement.pdf";

// Keep DEBUG true to see the red boxes. Set to false when perfect.
const DEBUG = true; 

const OFFSET_X = 0;
const OFFSET_Y = 0;

const FIELD_POSITIONS = {
  // ===============================================================
  // PAGE 1 (index 0) - Cover Page
  // Dropped Y down so they sit exactly on the dashed lines
  // ===============================================================
  page1_borrowerName:  { page: 0, x: 170, y: 465, size: 11 },
  page1_borrowerId:    { page: 0, x: 400, y: 465, size: 11 },
  page1_guarantorName: { page: 0, x: 170, y: 400, size: 11 },
  page1_guarantorId:   { page: 0, x: 400, y: 400, size: 11 },

  // ===============================================================
  // PAGE 2 (index 1) - Loan Summary Table
  // Pushed down ~80 points to land exactly on the blank lines
  // X shifted right to start after the printed text ("Full name:", "KES")
  // ===============================================================
  // Borrower Row
  page2_borrowerName:  { page: 1, x: 340, y: 638, size: 11 },
  page2_borrowerId:    { page: 1, x: 340, y: 623, size: 11 },
  
  // Guarantor Row
  page2_guarantorName: { page: 1, x: 340, y: 568, size: 11 },
  page2_guarantorId:   { page: 1, x: 340, y: 553, size: 11 },

  // Amount Row (Right after "KES ")
  page2_amount:        { page: 1, x: 360, y: 508, size: 11 },
  
  // Interest Row (Right after "KES ")
  page2_interest:      { page: 1, x: 555, y: 468, size: 11 },
  
  // Total to Repay Row (Right after "KES ")
  page2_total:         { page: 1, x: 360, y: 428, size: 11 },

  // ===============================================================
  // PAGE 5 (index 4) - Signatures
  // Borrower moved down slightly.
  // Guarantor moved WAY down (from 340 to 260) to skip the Witness block.
  // ===============================================================
  page5_borrowerName:  { page: 4, x: 150, y: 620, size: 11 },
  page5_borrowerId:    { page: 4, x: 150, y: 600, size: 11 },
  page5_guarantorName: { page: 4, x: 150, y: 260, size: 11 }, 
  page5_guarantorId:   { page: 4, x: 150, y: 240, size: 11 },
};

async function loadTemplateBytes() {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) {
    throw new Error(`Could not load the agreement template (HTTP ${res.status}). Check the filename in public/.`);
  }
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const firstBytesText = new TextDecoder("latin1").decode(bytes.slice(0, 1024)).toLowerCase();
  if (!firstBytesText.includes("%pdf-")) {
    throw new Error(`The file at ${TEMPLATE_URL} is not a valid PDF. Vite might be serving index.html instead.`);
  }
  return bytes;
}

function overlayText(pdfDoc, font, data) {
  const pages = pdfDoc.getPages();

  const draw = (key, text) => {
    const pos = FIELD_POSITIONS[key];
    if (!pos || text == null || text === "") return;
    const page = pages[pos.page];
    if (!page) return;

    const size = pos.size ?? 11;
    const x = pos.x + OFFSET_X;
    const y = pos.y + OFFSET_Y;

    page.drawText(String(text), {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });

    if (DEBUG) {
      const w = font.widthOfTextAtSize(String(text), size);
      page.drawRectangle({
        x: x - 2,
        y: y - 2,
        width: w + 4,
        height: size + 4,
        borderColor: rgb(1, 0, 0),
        borderWidth: 0.8,
      });
    }
  };

  const kes = (n) => `KES ${Number(n).toLocaleString("en-KE")}`;

  // Page 1
  draw("page1_borrowerName",  data.borrower.name);
  draw("page1_borrowerId",    `ID: ${data.borrower.idNumber}`);
  draw("page1_guarantorName", data.guarantor.name);
  draw("page1_guarantorId",   `ID: ${data.guarantor.idNumber}`);

  // Page 2
  draw("page2_borrowerName",  data.borrower.name);
  draw("page2_borrowerId",    data.borrower.idNumber);
  
  draw("page2_guarantorName", data.guarantor.name);
  draw("page2_guarantorId",   data.guarantor.idNumber);

  draw("page2_amount",   kes(data.amount));
  draw("page2_interest", kes(data.interest));
  draw("page2_total",    kes(data.total));

  // Page 5
  draw("page5_borrowerName",  data.borrower.name);
  draw("page5_borrowerId",    data.borrower.idNumber);
  draw("page5_guarantorName", data.guarantor.name);
  draw("page5_guarantorId",   data.guarantor.idNumber);
}

export async function generateAgreementPdf({
  borrower,
  guarantor,
  amount,
  interest,
  total,
  agreementNumber,
}) {
  const templateBytes = await loadTemplateBytes();
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const payload = { borrower, guarantor, amount, interest, total, agreementNumber };

  overlayText(pdfDoc, font, payload);

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}