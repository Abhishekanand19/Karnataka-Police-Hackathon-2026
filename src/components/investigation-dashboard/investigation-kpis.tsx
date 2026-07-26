"use client";

import React, { useMemo } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { FileText, Users, FolderOpen, AlertTriangle } from "lucide-react";

export const InvestigationKPIs: React.FC = () => {
  const { caseContext } = useInvestigation();

  const stats = useMemo(() => {
    if (!caseContext) return { riskScore: 0, suspects: 0, evidence: 0, relatedCases: 0 };
    const { fir, suspects, evidence, relatedFirs } = caseContext;

    return {
      riskScore: fir.riskScore,
      suspects: suspects.length,
      evidence: evidence.length,
      relatedCases: relatedFirs.length,
    };
  }, [caseContext]);

  const kpis = [
    { label: "Threat Score", value: stats.riskScore, icon: AlertTriangle, color: "text-semantic-danger", bg: "bg-semantic-danger/10" },
    { label: "Known Suspects", value: stats.suspects, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Evidence Items", value: stats.evidence, icon: FolderOpen, color: "text-accent", bg: "bg-accent/10" },
    { label: "Related Cases", value: stats.relatedCases, icon: FileText, color: "text-semantic-warning", bg: "bg-semantic-warning/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-surface/50 border border-border/80 rounded-2xl p-5 flex items-center justify-between hover:bg-surface transition-colors cursor-default">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{kpi.label}</span>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
            <kpi.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
};
