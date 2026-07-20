"use client";

import React from "react";
import { Panel } from "@/components/ui/panel";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NetworkNode, entityConfig } from "./network-graph-canvas";
import { GitFork, FileText, Users, ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";

export interface EntityIntelligencePanelProps {
  selectedNode: NetworkNode | null;
  onOpenDrawer: () => void;
}

export const EntityIntelligencePanel: React.FC<EntityIntelligencePanelProps> = ({
  selectedNode,
  onOpenDrawer,
}) => {
  if (!selectedNode) {
    return (
      <Panel title="Entity Intelligence" className="w-full lg:w-80 h-full">
        <div className="flex flex-col items-center justify-center p-8 text-center h-64 space-y-3">
          <div className="p-3 bg-surface rounded-full text-gray-500 border border-border">
            <GitFork className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h4 className="text-sm font-semibold text-white">No Entity Selected</h4>
          <p className="text-xs text-gray-400">
            Click on any node in the network graph to inspect criminal background, connected cases, and known associates.
          </p>
        </div>
      </Panel>
    );
  }

  const config = entityConfig[selectedNode.type] || entityConfig.Case;
  const Icon = config.icon;

  return (
    <Panel
      title="Entity Intelligence"
      action={
        selectedNode.risk ? (
          <RiskBadge level={selectedNode.risk} score={selectedNode.riskScore} />
        ) : (
          <Badge variant="info">{selectedNode.type}</Badge>
        )
      }
      className="w-full lg:w-80 space-y-4"
    >
      {/* Node Title & Type */}
      <div className="space-y-1.5 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bg} border ${config.border}`}>
            <Icon className="w-4 h-4" style={{ color: config.color }} />
          </div>
          <Badge variant="accent" size="sm">{config.label}</Badge>
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">{selectedNode.name}</h3>
        <div className="text-[11px] text-gray-400 font-mono">Entity ID: {selectedNode.id}</div>
      </div>

      {/* Details Box */}
      <div className="p-3 bg-surface/70 rounded-xl border border-border space-y-2 text-xs">
        <div className="font-semibold text-white">Operational Summary</div>
        <p className="text-gray-300 leading-relaxed text-[11px]">
          {selectedNode.details || "Active entity in current investigation workspace."}
        </p>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <GitFork className="w-3 h-3 text-primary" /> Links
          </div>
          <div className="text-base font-bold text-white font-mono">
            {selectedNode.relationshipsCount || 4} Rel
          </div>
        </div>

        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-accent" /> District
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {selectedNode.district || "Bengaluru"}
          </div>
        </div>
      </div>

      {/* Connected Cases & Associates List */}
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-primary" /> Connected Case FIRs
        </div>
        <div className="space-y-1">
          <div className="p-2 rounded-lg bg-surface/50 border border-border/50 flex justify-between font-mono">
            <span className="text-primary font-bold">FIR-2026-00491</span>
            <span className="text-gray-400">Primary Case</span>
          </div>
          <div className="p-2 rounded-lg bg-surface/50 border border-border/50 flex justify-between font-mono">
            <span className="text-primary">FIR-2026-00488</span>
            <span className="text-gray-400">Linked Incident</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        fullWidth
        size="sm"
        icon={<ArrowRight className="w-3.5 h-3.5" />}
        onClick={onOpenDrawer}
      >
        Inspect Full Relationship Evidence
      </Button>
    </Panel>
  );
};
