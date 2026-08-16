"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";

import { InvestigationHeader } from "@/components/investigation-dashboard/investigation-header";
import { PriorityDirective } from "@/components/investigation-dashboard/priority-directive";
import { AIInvestigationSummary } from "@/components/investigation-dashboard/ai-investigation-summary";
import { InvestigationKPIs } from "@/components/investigation-dashboard/investigation-kpis";
import { MiniInvestigationMap } from "@/components/investigation-dashboard/mini-investigation-map";
import { RelatedCasesList } from "@/components/investigation-dashboard/related-cases-list";
import { TimelinePreview } from "@/components/investigation-dashboard/timeline-preview";
import { InvestigationAlerts } from "@/components/investigation-dashboard/investigation-alerts";
import { CaseTasks } from "@/components/investigation-dashboard/case-tasks";

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
      router.push("/workspace/");
    }
  }, [mounted, officer, activeInvestigation, router]);

  if (!mounted) return <div className="page-loading">Loading active investigation…</div>;
  if (!activeInvestigation) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto">
        {/* Container keeps content readable on ultra-wide and stable under zoom */}
        <div className="mx-auto w-full max-w-[1680px] p-4 md:p-6 space-y-6">

          {/* Anchor: which case am I in */}
          <InvestigationHeader />

          {/* PRIMARY: what needs to happen right now */}
          <PriorityDirective />

          {/* SECONDARY: situational metrics */}
          <InvestigationKPIs />

          {/* PRIMARY analysis: AI read + spatial context.
              Equal fixed heights remove the "one column ends early" gap; both
              cards manage overflow internally, so they stay zoom-stable. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-[460px]">
              <AIInvestigationSummary />
            </div>
            <div className="lg:col-span-4 h-[460px]">
              <MiniInvestigationMap />
            </div>
          </div>

          {/* TERTIARY: supporting context. These cards scroll internally, so a
              fixed height is zoom-safe (content scrolls, never bleeds). */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="h-[360px]"><CaseTasks /></div>
            <div className="h-[360px]"><TimelinePreview /></div>
            <div className="h-[360px]"><RelatedCasesList /></div>
            <div className="h-[360px]"><InvestigationAlerts /></div>
          </div>

        </div>
      </div>
    </div>
  );
}
