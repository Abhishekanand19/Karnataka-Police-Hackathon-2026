"use client";

import React, { useState, useEffect } from "react";
import { ReportConfigurationSidebar, ReportConfig } from "@/components/intelligence-reports/report-configuration-sidebar";
import { DocumentPreviewCanvas } from "@/components/intelligence-reports/document-preview-canvas";

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    reportType: "Investigation Summary",
    includeTimeline: true,
    includeEvidence: true,
    includeNetwork: true,
    includeHotspot: true,
    includeAI: true,
    includeEntities: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Fake compilation delay to simulate AI processing the document
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  if (!mounted) return <div className="page-loading">Preparing intelligence dossier…</div>;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0a0c14] print:block print:h-auto print:overflow-visible print:bg-white">
      
      {/* 30% Configuration Sidebar (Hidden when printing) */}
      <div className="w-[400px] shrink-0 h-full z-10 relative shadow-2xl print:hidden">
        <ReportConfigurationSidebar 
          config={config} 
          setConfig={setConfig} 
          onGenerate={handleGenerate}
        />
      </div>

      {/* 70% Live Document Preview */}
      <div className="flex-1 h-full min-w-0 relative border-l border-border/50 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] print:border-none print:shadow-none print:w-full print:m-0">
        <DocumentPreviewCanvas config={config} isGenerating={isGenerating} />
      </div>

    </div>
  );
}
