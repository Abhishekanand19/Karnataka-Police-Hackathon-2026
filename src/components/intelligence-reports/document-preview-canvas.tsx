"use client";

import React from "react";
import { ReportConfig } from "./report-configuration-sidebar";
import { ReportTemplates } from "./report-templates";
import { Printer, Download, FileText } from "lucide-react";

interface DocumentPreviewCanvasProps {
  config: ReportConfig;
  isGenerating: boolean;
}

export const DocumentPreviewCanvas: React.FC<DocumentPreviewCanvasProps> = ({ config, isGenerating }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c14] relative">
      
      {/* Floating Action Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl p-1.5 shadow-2xl z-20 print:hidden">
        <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-r border-border/80 mr-1">
          <FileText className="w-4 h-4 text-primary" /> Live Preview
        </div>
        <button onClick={handlePrint} className="p-2 text-gray-400 hover:text-white hover:bg-card rounded-lg transition-colors group relative" title="Print Document">
          <Printer className="w-4 h-4 group-hover:text-primary transition-colors" />
        </button>
        <button onClick={handlePrint} className="p-2 text-gray-400 hover:text-white hover:bg-card rounded-lg transition-colors group" title="Download PDF">
          <Download className="w-4 h-4 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto px-4 py-20 md:py-24 print:p-0 print:overflow-visible">
        
        {isGenerating ? (
          <div className="max-w-[850px] min-h-[1100px] mx-auto bg-white shadow-2xl flex flex-col items-center justify-center print:hidden">
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <div className="mt-4 text-gray-500 font-bold tracking-widest uppercase text-sm">Compiling Intelligence...</div>
          </div>
        ) : (
          <div 
            className="max-w-[850px] min-h-[1100px] mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] print:shadow-none text-black relative print:w-full print:max-w-none print:m-0"
            style={{
              padding: "2cm", // Standard A4 margins roughly
            }}
          >
            <ReportTemplates config={config} />
          </div>
        )}

      </div>
    </div>
  );
};
