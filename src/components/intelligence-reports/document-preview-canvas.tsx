"use client";

import React, { useImperativeHandle, useRef, useState, forwardRef } from "react";
import { ReportConfig } from "./report-configuration-sidebar";
import { ReportTemplates } from "./report-templates";
import { useInvestigation } from "@/providers/investigation-provider";
import { Printer, Download, FileText, Loader2 } from "lucide-react";

interface DocumentPreviewCanvasProps {
  config: ReportConfig;
  isGenerating: boolean;
}

export interface DocumentPreviewHandle {
  exportPdf: () => Promise<void>;
}

export const DocumentPreviewCanvas = forwardRef<DocumentPreviewHandle, DocumentPreviewCanvasProps>(
  ({ config, isGenerating }, ref) => {
    const { activeFir } = useInvestigation();
    const printRef = useRef<HTMLDivElement>(null); // fixed-width off-screen capture source
    const [exporting, setExporting] = useState(false);

    const exportPdf = async () => {
      const el = printRef.current;
      if (!el || exporting) return;
      setExporting(true);
      try {
        // Loaded on demand so the ~200kB of PDF tooling never ships in the route bundle.
        const [{ default: html2canvas }, jspdf] = await Promise.all([import("html2canvas"), import("jspdf")]);
        const JsPDF = jspdf.jsPDF;

        // Capture the OFF-SCREEN, fixed-800px template — never the reactive UI preview.
        // Locking width + windowWidth keeps the aspect ratio A4-correct (no clipping,
        // no giant fonts, no page-count explosion).
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          width: 800,
          windowWidth: 800,
          scrollX: 0,
          scrollY: 0,
          logging: false,
        });

        const pdf = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
        const pageW = pdf.internal.pageSize.getWidth();   // 210mm
        const pageH = pdf.internal.pageSize.getHeight();  // 297mm
        // Image spans the full page width; the template's own 40px padding forms the
        // white margin, so slices never bleed into a physical page margin.
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;
        const imgData = canvas.toDataURL("image/jpeg", 0.96);

        let heightLeft = imgH;
        let position = 0;
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
        while (heightLeft > 0) {
          position -= pageH;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
          heightLeft -= pageH;
        }

        const fir = activeFir?.firNumber?.replace(/[^\w-]+/g, "") || "case";
        pdf.save(`KSP_Intelligence_Dossier_${fir}.pdf`);
      } finally {
        setExporting(false);
      }
    };

    useImperativeHandle(ref, () => ({ exportPdf }));

    return (
      <div className="flex flex-col h-full bg-[#0a0c14] relative">
        {/* Action bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl p-1.5 shadow-2xl z-20 print:hidden">
          <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-r border-border/80 mr-1">
            <FileText className="w-4 h-4 text-primary" /> Live Preview
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-card rounded-lg transition-colors text-xs font-semibold" title="Print (Ctrl+P)">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={exportPdf}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white rounded-lg transition-colors text-xs font-bold"
            title="Download as PDF"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? "Preparing…" : "Download PDF"}
          </button>
        </div>

        {/* On-screen preview (responsive, for viewing only) */}
        <div className="flex-1 overflow-y-auto px-4 py-20 md:py-24 print:p-0 print:overflow-visible">
          <div
            className="max-w-[850px] min-h-[1100px] mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] print:shadow-none text-black relative print:w-full print:max-w-none print:m-0"
            style={{ padding: "2cm" }}
          >
            <ReportTemplates config={config} />
          </div>
        </div>

        {/* OFF-SCREEN capture source — fixed A4-proportioned width, print-locked layout.
            Positioned far off-screen (not display:none, so it still lays out for capture). */}
        <div aria-hidden style={{ position: "fixed", left: "-10000px", top: 0, zIndex: -1, pointerEvents: "none" }}>
          <div
            ref={printRef}
            id="pdf-report-template"
            style={{
              width: "800px",
              minWidth: "800px",
              maxWidth: "800px",
              background: "#ffffff",
              color: "#0f172a",
              padding: "40px",
              boxSizing: "border-box",
            }}
          >
            <style>{`
              #pdf-report-template table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; }
              #pdf-report-template th, #pdf-report-template td {
                word-wrap: break-word !important; overflow-wrap: break-word !important; word-break: break-word !important;
                vertical-align: top;
              }
              #pdf-report-template tr, #pdf-report-template section, #pdf-report-template h2 { page-break-inside: avoid; }
              #pdf-report-template * { max-width: 100% !important; }
              #pdf-report-template .break-all, #pdf-report-template .font-mono { word-break: break-all !important; }
            `}</style>
            <ReportTemplates config={config} />
          </div>
        </div>

        {(isGenerating || exporting) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0a0c14]/80 backdrop-blur-sm print:hidden">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <div className="mt-4 text-gray-300 font-bold tracking-widest uppercase text-sm">
              {exporting ? "Rendering official PDF…" : "Compiling intelligence…"}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DocumentPreviewCanvas.displayName = "DocumentPreviewCanvas";
