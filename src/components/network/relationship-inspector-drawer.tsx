"use client";

import React from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Button } from "@/components/ui/button";
import { NetworkNode, entityConfig } from "./network-graph-canvas";
import { GitFork, FileText, Phone, CreditCard, Car, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";

export interface RelationshipInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: NetworkNode | null;
}

export const RelationshipInspectorDrawer: React.FC<RelationshipInspectorDrawerProps> = ({
  isOpen,
  onClose,
  node,
}) => {
  if (!node) return null;

  const config = entityConfig[node.type] || entityConfig.Case;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Relationship Evidence: ${node.name}`}
      size="xl"
    >
      <div className="space-y-6 text-xs text-gray-200">
        {/* Header Summary */}
        <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">{config.label}</Badge>
              <span className="font-bold text-white text-sm">{node.name}</span>
            </div>
            {node.risk && <RiskBadge level={node.risk} score={node.riskScore} />}
          </div>
          <p className="text-gray-300 leading-relaxed text-[11px]">
            {node.details || "Analyzed within Karnataka Police ERD Criminal Relationship Graph."}
          </p>
        </div>

        {/* Evidence Link Summary */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-primary" /> Verified Association Strength
          </h4>
          <div className="p-3 bg-surface/60 rounded-xl border border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Primary Link Type:</span>
              <Badge variant="danger" size="sm">Critical Direct Link (Score 94/100)</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Association Evidence:</span>
              <span className="font-mono text-semantic-success">3 Co-occurrences in FIR Records</span>
            </div>
          </div>
        </div>

        {/* Shared Telecommunications & Accounts */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-accent" /> Shared Telecommunications & Financial Assets
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-surface/50 rounded-xl border border-border/50 space-y-1">
              <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-teal-400" /> Mobile Contact
              </div>
              <div className="font-mono font-bold text-white text-xs">+91 98450 11029</div>
              <div className="text-[10px] text-gray-400">Used in 3 Phishing Scams</div>
            </div>

            <div className="p-3 bg-surface/50 rounded-xl border border-border/50 space-y-1">
              <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-amber-500" /> Bank Mule A/C
              </div>
              <div className="font-mono font-bold text-white text-xs">948102841 (Canara)</div>
              <div className="text-[10px] text-gray-400">Frozen by STF Order</div>
            </div>
          </div>
        </div>

        {/* Shared Vehicles & Modus Operandi */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-purple-400" /> Shared Vehicles & Modus Operandi
          </h4>
          <div className="p-3 bg-surface/50 rounded-xl border border-border/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Vehicle Registration:</span>
              <span className="font-mono font-bold text-white">KA-01-MJ-8910 (Black Pulsar)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Common MO Pattern:</span>
              <span className="font-mono text-emerald-400">Crowbar Lock Bypassing</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border">
          <Button variant="primary" fullWidth icon={<ChevronRight className="w-4 h-4" />}>
            Export Full Network Evidence Report
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
