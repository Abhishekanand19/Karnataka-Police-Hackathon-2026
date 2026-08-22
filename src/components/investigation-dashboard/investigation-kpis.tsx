"use client";

import React, { useMemo, useState } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { FileText, Users, FolderOpen, AlertTriangle, Maximize2 } from "lucide-react";
import { EntityDetailDrawer, DrawerView } from "@/components/investigation/entity-detail-drawer";

export const InvestigationKPIs: React.FC = () => {
  const { caseContext } = useInvestigation();
  const [view, setView] = useState<DrawerView>(null);

  const stats = useMemo(() => {
    if (!caseContext) return { riskScore: 0, suspects: 0, evidence: 0, relatedCases: 0 };
    const { fir, suspects, evidence, relatedFirs } = caseContext;
    return { riskScore: fir.riskScore, suspects: suspects.length, evidence: evidence.length, relatedCases: relatedFirs.length };
  }, [caseContext]);

  const kpis: { label: string; value: number; icon: React.ElementType; color: string; bg: string; view: DrawerView }[] = [
    { label: "Threat Score", value: stats.riskScore, icon: AlertTriangle, color: "text-semantic-danger", bg: "bg-semantic-danger/10", view: "threat" },
    { label: "Known Suspects", value: stats.suspects, icon: Users, color: "text-primary", bg: "bg-primary/10", view: "suspects" },
    { label: "Evidence Items", value: stats.evidence, icon: FolderOpen, color: "text-accent", bg: "bg-accent/10", view: "evidence" },
    { label: "Related Cases", value: stats.relatedCases, icon: FileText, color: "text-semantic-warning", bg: "bg-semantic-warning/10", view: "related" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <button
            key={idx}
            onClick={() => setView(kpi.view)}
            className="group relative text-left bg-surface/50 border border-border/80 rounded-2xl p-5 flex items-center justify-between transition-all hover:bg-surface hover:border-primary/40 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{kpi.label}</span>
              <div className="text-[28px] leading-none font-bold text-white tabular-nums">{kpi.value}</div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <Maximize2 className="absolute right-3 top-3 w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
      <EntityDetailDrawer view={view} onClose={() => setView(null)} />
    </>
  );
};
