"use client";

import React from "react";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, RiskLevel } from "@/components/ui/risk-badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, ShieldAlert, GitFork, Activity, CheckCircle2, ChevronRight } from "lucide-react";

export interface EvidenceItem {
  firId: string;
  title: string;
  district: string;
  policeStation: string;
  risk: RiskLevel;
  riskScore: number;
  date: string;
  mo: string;
  relationships: number;
}

export const mockEvidenceItems: EvidenceItem[] = [
  { firId: "FIR-2026-00491", title: "₹4.2L Phishing Scam", district: "Bengaluru Urban", policeStation: "HSR Layout PS", risk: "Critical", riskScore: 89, date: "14 July 2026", mo: "Social Engineering OTP Phishing", relationships: 6 },
  { firId: "FIR-2026-00488", title: "Indiranagar Night Theft", district: "Bengaluru Urban", policeStation: "Indiranagar PS", risk: "High", riskScore: 78, date: "12 July 2026", mo: "Crowbar Lock Bypassing", relationships: 5 },
  { firId: "FIR-2026-00485", title: "Commercial Office Burglary", district: "Bengaluru Urban", policeStation: "Indiranagar PS", risk: "High", riskScore: 74, date: "10 July 2026", mo: "Crowbar Lock Bypassing", relationships: 4 },
];

export interface EvidencePanelProps {
  activeEvidenceId?: string | null;
  onSelectEvidence?: (firId: string) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  activeEvidenceId,
  onSelectEvidence,
}) => {
  return (
    <Panel
      title="Evidence Panel"
      action={
        <Badge variant="accent" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Records
        </Badge>
      }
      className="w-full lg:w-80 space-y-4 select-none"
    >
      {/* Evidence Summary Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <FileText className="w-3 h-3 text-primary" /> Cited FIRs
          </div>
          <div className="text-base font-bold text-white font-mono">{mockEvidenceItems.length} Records</div>
        </div>

        <div className="p-2.5 bg-surface/70 rounded-xl border border-border space-y-1">
          <div className="text-[10px] uppercase text-gray-400 font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-semantic-danger" /> Max Risk
          </div>
          <div className="text-base font-bold text-semantic-danger font-mono">89 (Critical)</div>
        </div>
      </div>

      {/* Cited FIR Cards */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-white uppercase tracking-wider flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-accent" /> Active Cited FIR Dossiers
        </div>

        <div className="space-y-2">
          {mockEvidenceItems.map((item) => {
            const isSelected = item.firId === activeEvidenceId;
            return (
              <div
                key={item.firId}
                onClick={() => onSelectEvidence && onSelectEvidence(item.firId)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-primary/15 border-primary shadow-lg ring-2 ring-primary/40"
                    : "bg-surface/60 border-border hover:border-gray-500 hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary text-xs">{item.firId}</span>
                  <RiskBadge level={item.risk} score={item.riskScore} />
                </div>

                <div className="font-semibold text-white text-xs">{item.title}</div>

                <div className="text-[11px] text-gray-400 space-y-1 pt-1 border-t border-border/40">
                  <div className="flex justify-between">
                    <span>Station:</span>
                    <span className="text-gray-200">{item.policeStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MO Profile:</span>
                    <span className="text-accent font-mono truncate max-w-[140px]">{item.mo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graph Links:</span>
                    <span className="text-primary font-mono">{item.relationships} Associated Nodes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Policy Footer */}
      <div className="p-3 bg-surface/40 rounded-xl border border-border/40 text-[11px] text-gray-400 space-y-1">
        <div className="font-semibold text-white flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-semantic-success" /> Evidence Guard Rule
        </div>
        <p className="leading-relaxed">
          AI Copilot never produces unsupported legal conclusions. If FIR citations are missing, response will return &quot;Insufficient Evidence&quot;.
        </p>
      </div>
    </Panel>
  );
};
