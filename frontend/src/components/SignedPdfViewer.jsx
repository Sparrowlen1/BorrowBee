// src/components/SignedPdfViewer.jsx
import { FileText, Download, ExternalLink } from "lucide-react";

export default function SignedPdfViewer({ 
  url, 
  title = "Signed loan agreement", 
  fileName = "BorrowBee-Signed-Agreement.pdf" 
}) {
  const hasFile = url && url !== "#" && url !== "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center gap-2">
        <p className="m-0 text-[#A9C4BE] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
          <FileText size={11} /> {title}
        </p>
        
        {hasFile && (
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7FF0DC] text-xs font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <ExternalLink size={12} />
              Open
            </a>
            <a
              href={url}
              download={fileName}
              className="text-[#FFB300] text-xs font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <Download size={12} />
              Download
            </a>
          </div>
        )}
      </div>

      {hasFile ? (
        <iframe
          src={url}
          title={title}
          className="w-full h-[420px] rounded-xl border border-white/10 bg-black/40"
        />
      ) : (
        <div className="w-full min-h-[160px] rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 text-center px-4 py-6">
          <FileText size={28} className="text-[#A9C4BE]" />
          <p className="text-[#A9C4BE] text-[13px] m-0">No PDF uploaded yet.</p>
          <p className="text-[#A9C4BE] text-[11px] m-0">
            The borrower has not attached their signed agreement.
          </p>
        </div>
      )}
    </div>
  );
}