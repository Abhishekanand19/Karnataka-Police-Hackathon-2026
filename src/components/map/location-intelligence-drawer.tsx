"use client";

import React from "react";
import { Drawer } from "@/components/ui/drawer";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HotspotPoint } from "./spatial-map-canvas";
import { Shield, FileText, History, MapPin, CheckCircle2, ChevronRight, FileSearch } from "lucide-react";

export interface LocationIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hotspot: HotspotPoint | null;
}

export const LocationIntelligenceDrawer: React.FC<LocationIntelligenceDrawerProps> = ({
  isOpen,
  onClose,
  hotspot,
}) => {
  if (!hotspot) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${hotspot.name} Dossier`}
      size="xl"
    >
      <div className="space-y-6 text-xs text-gray-200">
        {/* Header Summary */}
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-bold text-white text-sm">{hotspot.district}</span>
            </div>
            <RiskBadge level={hotspot.risk} score={hotspot.riskScore} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border/50">
            <div className="p-2 bg-card rounded-lg">
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Total Incidents</div>
              <div className="text-sm font-bold text-white font-mono">{hotspot.cases}</div>
            </div>
            <div className="p-2 bg-card rounded-lg">
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Open FIRs</div>
              <div className="text-sm font-bold text-semantic-warning font-mono">{hotspot.openCases}</div>
            </div>
            <div className="p-2 bg-card rounded-lg">
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Clearance</div>
              <div className="text-sm font-bold text-semantic-success font-mono">{hotspot.solvedRate}</div>
            </div>
          </div>
        </div>

        {/* Primary Station Details */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" /> Primary Jurisdiction Police Station
          </h4>
          <div className="p-3 bg-surface/60 rounded-xl border border-border/60 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">{hotspot.policeStation}</div>
              <div className="text-gray-400 text-[11px]">Primary Sector Station • Active Monitoring</div>
            </div>
            <Badge variant="success" size="sm">Operational</Badge>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FileSearch className="w-3.5 h-3.5 text-accent" /> Spatial Crime Vector Breakdown
          </h4>
          <div className="p-3 bg-surface/50 rounded-xl border border-border/50 space-y-2">
            {[
              { category: hotspot.topCrime, percent: "42%", count: Math.round(hotspot.cases * 0.42) },
              { category: "Secondary Property Theft", percent: "31%", count: Math.round(hotspot.cases * 0.31) },
              { category: "Financial Cyber Fraud", percent: "27%", count: Math.round(hotspot.cases * 0.27) },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300 font-medium">{cat.category}</span>
                  <span className="font-mono font-bold text-white">{cat.count} ({cat.percent})</span>
                </div>
                <div className="h-1.5 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: cat.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent FIRs */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-semantic-warning" /> Recent Linked FIR Dossiers
          </h4>
          <div className="space-y-2">
            {[
              { id: "FIR-2026-00491", type: "Property Burglary", date: "Today 12:45 IST", status: "Under Investigation" },
              { id: "FIR-2026-00488", type: "Cyber Fraud Scam", date: "Yesterday 18:20 IST", status: "Suspect Identified" },
              { id: "FIR-2026-00485", type: "Nighttime Theft", date: "3 days ago", status: "Chargesheet Filed" },
            ].map((fir) => (
              <div key={fir.id} className="p-2.5 bg-surface/60 rounded-xl border border-border/50 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-primary">{fir.id}</div>
                  <div className="text-gray-400 text-[11px]">{fir.type} • {fir.date}</div>
                </div>
                <Badge variant="neutral" size="sm">{fir.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-border flex items-center gap-3">
          <Button variant="primary" fullWidth icon={<ChevronRight className="w-4 h-4" />}>
            Open Network Graph for {hotspot.district}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
