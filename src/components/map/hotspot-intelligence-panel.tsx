"use client";

import React from "react";
import { Panel } from "@/components/ui/panel";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HotspotPoint } from "./spatial-map-canvas";
import { MapPin, ShieldAlert, FileText, Users, Activity, FileSearch, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const sparkData = [{ v: 20 }, { v: 24 }, { v: 22 }, { v: 28 }, { v: 32 }, { v: 35 }, { v: 38 }];

export interface HotspotIntelligencePanelProps {
  hotspot: HotspotPoint | null;
  onOpenDrawer: () => void;
}

export const HotspotIntelligencePanel: React.FC<HotspotIntelligencePanelProps> = ({
  hotspot,
  onOpenDrawer,
}) => {
  if (!hotspot) {
    return (
      <Panel title="Hotspot Intelligence" className="w-full lg:w-80 h-full">
        <div className="flex flex-col items-center justify-center p-8 text-center h-64 space-y-3">
          <div className="p-3 bg-surface rounded-full text-gray-500 border border-border">
            <MapPin className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Location Selected</h4>
          <p className="text-xs text-gray-400">
            Click on any hotspot pulse or district pin on the map to inspect real-time spatial intelligence.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Hotspot Intelligence"
      action={<RiskBadge level={hotspot.risk} score={hotspot.riskScore} />}
      className="w-full lg:w-80 space-y-4"
    >
      {/* Selected Location Title */}
      <div className="space-y-1 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{hotspot.district}</span>
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">{hotspot.name}</h3>
        <div className="text-[11px] text-gray-400">{hotspot.policeStation} • ID: {hotspot.id}</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <FileText className="w-3 h-3 text-primary" /> Total FIRs
          </div>
          <div className="text-base font-bold text-white font-mono">{hotspot.cases}</div>
        </div>

        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 text-semantic-danger" /> Trend Surge
          </div>
          <div className="text-base font-bold text-semantic-danger font-mono">{hotspot.trend}</div>
        </div>

        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <FileSearch className="w-3 h-3 text-semantic-warning" /> Open Cases
          </div>
          <div className="text-base font-bold text-semantic-warning font-mono">{hotspot.openCases}</div>
        </div>

        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3 text-accent" /> Repeat Offenders
          </div>
          <div className="text-base font-bold text-accent font-mono">{hotspot.repeatOffenders}</div>
        </div>
      </div>

      {/* Trend Mini Sparkline */}
      <div className="p-3 bg-surface/50 rounded-xl border border-border/60 space-y-1">
        <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium">
          <span>7-Day Surge Trend</span>
          <span className="font-mono text-semantic-danger">{hotspot.trend}</span>
        </div>
        <div className="h-10 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Primary Crime Description */}
      <div className="space-y-1 p-2.5 bg-surface/40 rounded-xl border border-border/50 text-xs">
        <span className="text-[11px] text-gray-400 font-semibold">Primary Crime Vector:</span>
        <div className="font-semibold text-white">{hotspot.topCrime}</div>
        <div className="text-[11px] text-semantic-success">Clearance Rate: {hotspot.solvedRate}</div>
      </div>

      {/* Launch Drawer Button */}
      <Button
        variant="primary"
        fullWidth
        size="sm"
        icon={<ArrowRight className="w-3.5 h-3.5" />}
        onClick={onOpenDrawer}
      >
        View Full Location Dossier
      </Button>
    </Panel>
  );
};
