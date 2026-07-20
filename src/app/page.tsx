"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { ShieldAlert, FileSearch, Users, Activity, ExternalLink, Filter } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <AlertBanner
        variant="warning"
        title="Active Operational Alert: Emerging Hotspot Detected"
        action={
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        }
      >
        Bengaluru Urban (Indiranagar Sub-division) exhibits a +34% surge in nighttime property crime over the last 14 days. 4 linked FIRs identified with matching Modus Operandi.
      </AlertBanner>

      {/* Page Header */}
      <PageHeader
        title="Crime Intelligence Overview"
        description="Real-time operational dashboard for Karnataka State Police SCRB. Monitoring state-wide incidents, risk scores, and emerging patterns."
        badge={<Badge variant="accent">Phase 1 Foundation</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <SearchBar placeholder="Filter dashboard by FIR or District..." />
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Cases"
          value="15,420"
          trend={{ value: "4.2%", direction: "up", label: "vs last month" }}
          icon={<FileSearch className="w-5 h-5" />}
        />
        <StatCard
          title="Active Hotspots"
          value="12"
          trend={{ value: "2", direction: "up", label: "new this week" }}
          icon={<ShieldAlert className="w-5 h-5 text-semantic-warning" />}
        />
        <StatCard
          title="Identified Repeat Offenders"
          value="1,840"
          trend={{ value: "1.5%", direction: "down", label: "vs last quarter" }}
          icon={<Users className="w-5 h-5 text-accent" />}
        />
        <StatCard
          title="Statewide Risk Score"
          value="74.5 / 100"
          trend={{ value: "Stable", direction: "neutral", label: "Moderate state risk" }}
          icon={<Activity className="w-5 h-5 text-semantic-info" />}
        />
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols - Spatial & Trends Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Panel
            title="Statewide Hotspot Map Preview"
            action={<RiskBadge level="High" score={82} />}
          >
            <div className="h-72 bg-surface/60 rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-6 text-center">
              <ShieldAlert className="w-12 h-12 text-gray-500 mb-3" />
              <h4 className="text-sm font-semibold text-white">Spatial Map Engine Placeholder</h4>
              <p className="text-xs text-gray-400 max-w-md mt-1 mb-4">
                Mapbox GL interactive vector rendering will be initialized in Phase 4. Mapbox dependencies are fully pre-configured.
              </p>
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Preview Spatial Layer Schema
              </Button>
            </div>
          </Panel>

          <Panel title="Recent Case Activity Feed">
            <SectionHeader
              title="Statewide FIR Ingestion"
              subtitle="Latest synchronized records from Karnataka Police ERD"
            />
            <div className="space-y-3">
              {[
                { id: "FIR-2026-00491", district: "Bengaluru Urban", type: "Cyber Crime", risk: "High" as const, time: "12 mins ago" },
                { id: "FIR-2026-00490", district: "Mysuru City", type: "Armed Robbery", risk: "Critical" as const, time: "45 mins ago" },
                { id: "FIR-2026-00489", district: "Mangaluru", type: "Smuggling", risk: "Medium" as const, time: "2 hours ago" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface/70 border border-border/50 hover:border-gray-500/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">{item.id}</span>
                      <Badge variant="neutral" size="sm">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">{item.district} • {item.time}</div>
                  </div>
                  <RiskBadge level={item.risk} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right 1 Col - High Risk Districts Panel */}
        <div className="space-y-6">
          <Panel title="District Risk Index">
            <div className="space-y-3">
              {[
                { district: "Bengaluru Urban", score: 88, status: "Critical" as const, cases: 4120 },
                { district: "Mysuru", score: 76, status: "High" as const, cases: 1850 },
                { district: "Dakshina Kannada", score: 71, status: "High" as const, cases: 1420 },
                { district: "Belagavi", score: 58, status: "Medium" as const, cases: 980 },
                { district: "Hubballi-Dharwad", score: 42, status: "Low" as const, cases: 640 },
              ].map((d) => (
                <div
                  key={d.district}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/40"
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{d.district}</div>
                    <div className="text-[11px] text-gray-400">{d.cases} Total FIRs</div>
                  </div>
                  <RiskBadge level={d.status} score={d.score} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
