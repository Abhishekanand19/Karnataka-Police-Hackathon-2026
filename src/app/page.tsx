"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";

import { InvestigationHeader } from "@/components/investigation-dashboard/investigation-header";
import { AIInvestigationSummary } from "@/components/investigation-dashboard/ai-investigation-summary";
import { InvestigationKPIs } from "@/components/investigation-dashboard/investigation-kpis";
import { MiniInvestigationMap } from "@/components/investigation-dashboard/mini-investigation-map";
import { RelatedCasesList } from "@/components/investigation-dashboard/related-cases-list";
import { TimelinePreview } from "@/components/investigation-dashboard/timeline-preview";
import { RecommendedActions } from "@/components/investigation-dashboard/recommended-actions";
import { InvestigationAlerts } from "@/components/investigation-dashboard/investigation-alerts";

export default function OperationalDashboard() {
  const router = useRouter();
  const { activeInvestigation, officer } = useInvestigation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to workspace if no active investigation is set
  useEffect(() => {
    if (mounted && officer && !activeInvestigation) {
      router.push("/workspace");
    }
  }, [mounted, officer, activeInvestigation, router]);

  if (!mounted) return <div className="page-loading">Loading active investigation…</div>;
  if (!activeInvestigation) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Header Section */}
        <InvestigationHeader />

        {/* Row 1: KPIs */}
        <InvestigationKPIs />

        {/* Row 2: Hero Section (Summary + Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
          <div className="lg:col-span-8 h-full">
            <AIInvestigationSummary />
          </div>
          <div className="lg:col-span-4 h-full">
            <MiniInvestigationMap />
          </div>
        </div>

        {/* Row 3: Secondary Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[400px]">
          <TimelinePreview />
          <RelatedCasesList />
          <RecommendedActions />
          <InvestigationAlerts />
        </div>

      </div>
    </div>
  );
}
