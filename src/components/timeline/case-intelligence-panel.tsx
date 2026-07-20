"use client";

import React from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ShieldAlert, Users, GitFork, Sparkles, Download, ArrowRight } from "lucide-react";

export const CaseIntelligencePanel: React.FC = () => {
  return (
    <Panel
      title="Case Intelligence Inspector"
      action={<RiskBadge level="Critical" score={89} />}
      className="w-full lg:w-80 space-y-4 select-none"
    >
      {/* Case Overview */}
      <div className="space-y-1 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-primary text-xs">FIR-2026-00491</span>
          <Badge variant="success" size="sm">Chargesheet Filed</Badge>
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">₹4.2L Cyber Phishing & Theft</h3>
        <div className="text-[11px] text-gray-400">Bengaluru Urban • HSR Layout PS</div>
      </div>

      {/* Repeat Offenders & Associates */}
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-accent" /> Identified Repeat Suspects (2)
        </div>
        <div className="space-y-1.5">
          <div className="p-2 bg-surface/70 rounded-xl border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Rajesh Kumar (A-901)</div>
              <div className="text-[10px] text-gray-400">Prime Suspect • 4 Linked FIRs</div>
            </div>
            <RiskBadge level="Critical" />
          </div>
          <div className="p-2 bg-surface/70 rounded-xl border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Suresh &quot;Spider&quot; V. (A-402)</div>
              <div className="text-[10px] text-gray-400">Co-Accused • Burglaries</div>
            </div>
            <RiskBadge level="High" />
          </div>
        </div>
      </div>

      {/* Compact Relationship Preview */}
      <div className="p-3 bg-surface/50 rounded-xl border border-border space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-primary" /> Relationship Graph
          </span>
          <span className="font-mono text-primary">6 Linked Nodes</span>
        </div>
        <p className="text-[11px] text-gray-400">
          Connected via shared phone +91 98450 11029 and Canara Bank Mule A/C 948102841.
        </p>
        <Link href="/network">
          <Button variant="ghost" size="sm" fullWidth icon={<ArrowRight className="w-3 h-3" />}>
            Open Network Workspace
          </Button>
        </Link>
      </div>

      {/* Executive Intelligence Brief Preview Card */}
      <div className="p-3.5 bg-gradient-to-br from-primary/10 via-surface to-accent/10 rounded-xl border border-primary/30 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Executive Brief Preview
          </span>
          <Badge variant="accent" size="sm">Audited</Badge>
        </div>

        <p className="text-[11px] text-gray-200 leading-relaxed">
          Comprehensive 12-step investigation complete. 9 forensic attachments and CDR logs verify primary accused involvement.
        </p>

        <Button
          variant="secondary"
          size="sm"
          fullWidth
          icon={<Download className="w-3.5 h-3.5" />}
          onClick={() => alert("Dossier export initiated via Catalyst SmartBrowz...")}
        >
          Export Executive Brief PDF
        </Button>
      </div>
    </Panel>
  );
};
