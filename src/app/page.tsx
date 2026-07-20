"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { GlobalAlertBanner } from "@/components/dashboard/global-alert-banner";
import { DashboardFilters, FilterState } from "@/components/dashboard/dashboard-filters";
import { KpiSection } from "@/components/dashboard/kpi-section";
import { TrendChartsSection } from "@/components/dashboard/trend-charts-section";
import { DistrictIntelligenceTable } from "@/components/dashboard/district-intelligence-table";
import { EmergingAlertsFeed } from "@/components/dashboard/emerging-alerts-feed";
import { CrimeCategoryGrid } from "@/components/dashboard/crime-category-grid";
import { InvestigationActivityFeed } from "@/components/dashboard/investigation-activity-feed";
import { AiInsightPreview } from "@/components/dashboard/ai-insight-preview";
import { RefreshCw, Download, Layers, ShieldCheck, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Global Alert Banner */}
      <GlobalAlertBanner />

      {/* 2. Page Header */}
      <PageHeader
        title="Crime Intelligence Command Dashboard"
        description="Operational overview of statewide crime records, hotspot analytics, and criminal intelligence for Karnataka State Police."
        badge={
          <Badge variant="accent" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Live Command Stream
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono text-gray-400 mr-2">
              Updated: {lastRefreshed}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
              onClick={handleRefresh}
            >
              Refresh Stream
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => setExportModalOpen(true)}
            >
              Export Intelligence
            </Button>
          </div>
        }
      />

      {/* Skeleton Loading Demo Toggle Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-card/40 border border-border/40 rounded-xl text-xs">
        <span className="text-gray-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Command Centre View Mode:
        </span>
        <button
          onClick={() => setLoading(!loading)}
          className="text-primary hover:underline font-semibold"
        >
          {loading ? "Disable Loading Skeletons" : "Simulate Loading Skeleton State"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <LoadingSkeleton variant="card" count={6} />
          <LoadingSkeleton variant="table" count={5} />
        </div>
      ) : (
        <>
          {/* 3. Quick Filters */}
          <DashboardFilters onFilterChange={(f) => setActiveFilters(f)} />

          {/* Active Filter Notification Bar */}
          {activeFilters && activeFilters.district !== "all" && (
            <div className="p-2.5 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary flex items-center justify-between font-medium">
              <span>
                Filtered by District: <strong>{activeFilters.district.replace("_", " ").toUpperCase()}</strong>
              </span>
              <span className="text-gray-400 text-[11px]">Filtered in-memory • 100% Client-side</span>
            </div>
          )}

          {/* 4. Primary KPI Grid (6 Cards) */}
          <KpiSection />

          {/* 5. Crime Category Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Statewide Crime Category Volume
            </h3>
            <CrimeCategoryGrid />
          </div>

          {/* 6. Crime Trend Analytics Section (Recharts) */}
          <TrendChartsSection />

          {/* 7. District Intelligence Risk Index Table */}
          <DistrictIntelligenceTable />

          {/* 8. Emerging Alerts & Investigation Activity Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmergingAlertsFeed />
            <InvestigationActivityFeed />
          </div>

          {/* 9. AI Insight Preview */}
          <AiInsightPreview />
        </>
      )}

      {/* Export Intelligence Dossier Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Crime Intelligence Dossier"
        description="Generate executive PDF dossier powered by Catalyst SmartBrowz"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Dossier Classification:</span>
              <span className="font-semibold text-white">CONFIDENTIAL / SCRB INTERNAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Target Coverage:</span>
              <span className="font-mono text-gray-200">25 Districts • 15,420 Cases</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Export Format:</span>
              <span className="font-mono text-accent">PDF (Catalyst SmartBrowz)</span>
            </div>
          </div>

          <p className="text-gray-300">
            PDF report generation will compile statewide KPI summaries, risk tables, and evidence citations in Phase 9.
          </p>

          <Button variant="primary" fullWidth icon={<Download className="w-4 h-4" />} onClick={() => setExportModalOpen(false)}>
            Download Sample Executive Summary
          </Button>
        </div>
      </Modal>
    </div>
  );
}
