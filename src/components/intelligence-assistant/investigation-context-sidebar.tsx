"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import {
  Bot, ShieldAlert, FileText,
  Users, Network, FolderOpen, ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityDetailDrawer, DrawerView } from "@/components/investigation/entity-detail-drawer";

interface SidebarProps {
  onQuickAction: (action: string) => void;
}

export const InvestigationContextSidebar: React.FC<SidebarProps> = ({ onQuickAction }) => {
  const router = useRouter();
  const { activeInvestigation, officer, caseContext } = useInvestigation();
  const [view, setView] = useState<DrawerView>(null);

  const fir = useMemo(() => {
    return MOCK_DB.firs.find(f => f.firNumber === activeInvestigation?.entityId);
  }, [activeInvestigation]);

  // Real linked-entity total (was a fabricated linkedSuspects*3+2).
  const networkNodes = caseContext
    ? caseContext.suspects.length + caseContext.victims.length + caseContext.phones.length + caseContext.accounts.length + (caseContext.vehicles?.length || 0)
    : 0;

  if (!activeInvestigation || !fir) {
    return (
      <div className="flex flex-col h-full bg-surface border-r border-border/80 shadow-2xl p-6 items-center justify-center text-center">
        <Bot className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-white font-bold mb-2">No Context Loaded</h3>
        <p className="text-sm text-gray-400 mb-6">Select an investigation to load into the AI context window.</p>
        <button 
          onClick={() => router.push("/workspace/")}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Workspace
        </button>
      </div>
    );
  }

  const evidenceCount = MOCK_DB.evidence.filter(e => e.firId === fir.firNumber).length;

  // Phrased as real investigator questions (not template labels) and covering the
  // engine's full range of intents, including the money trail and next-step reasoning.
  const quickActions = [
    "Give me a case brief",
    "Who is the primary suspect?",
    "Trace the money trail",
    "Assess the threat level",
    "Find linked cases",
    "What should I do next?",
  ];

  return (
    <>
    <div className="flex flex-col h-full bg-surface border-r border-border/80 shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-border/50 bg-card/30">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-white uppercase tracking-wider">AI Copilot</span>
        </div>
        <div className="text-[10px] text-primary uppercase font-mono tracking-widest font-semibold mb-1">Active Context Loaded</div>
        <h2 className="text-lg font-bold text-white tracking-tight break-all">{fir.firNumber}</h2>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={fir.status === "Closed" ? "neutral" : "danger"} size="sm">{fir.status}</Badge>
          <Badge variant={fir.riskScore > 80 ? "danger" : "warning"} size="sm">{fir.riskScore} Risk Score</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Known Entities in Context */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Entities in Context</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setView("suspects")} className="group p-2.5 bg-card/40 hover:bg-card border border-border/50 hover:border-primary/40 rounded-lg flex items-center justify-between transition-colors">
              <span className="text-xs text-gray-400 group-hover:text-gray-200 font-semibold">Suspects</span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm tabular-nums">
                <Users className="w-3.5 h-3.5 text-primary" /> {caseContext?.suspects.length ?? fir.linkedSuspects.length}
              </div>
            </button>
            <button onClick={() => setView("evidence")} className="group p-2.5 bg-card/40 hover:bg-card border border-border/50 hover:border-primary/40 rounded-lg flex items-center justify-between transition-colors">
              <span className="text-xs text-gray-400 group-hover:text-gray-200 font-semibold">Evidence</span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm tabular-nums">
                <FolderOpen className="w-3.5 h-3.5 text-accent" /> {evidenceCount}
              </div>
            </button>
            <button onClick={() => setView("network")} className="group p-2.5 bg-card/40 hover:bg-card border border-border/50 hover:border-primary/40 rounded-lg flex items-center justify-between transition-colors col-span-2">
              <span className="text-xs text-gray-400 group-hover:text-gray-200 font-semibold">Linked Entities</span>
              <div className="flex items-center gap-1.5 text-white font-bold text-sm tabular-nums">
                <Network className="w-3.5 h-3.5 text-semantic-warning" /> {networkNodes}
              </div>
            </button>
          </div>
        </div>

        {/* System Prompt Info */}
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1 mb-1">
            <ShieldAlert className="w-3 h-3" /> Copilot Ready
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            The AI has ingested the FIR, evidence logs, and timeline. You do not need to repeat case details.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => onQuickAction(action)}
                className="w-full text-left p-2.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
              >
                {action}
                <FileText className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-card/30">
        <button 
          onClick={() => router.push("/workspace/")}
          className="w-full py-2 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-bold text-white transition-colors"
        >
          Change Investigation
        </button>
      </div>

    </div>
    <EntityDetailDrawer view={view} onClose={() => setView(null)} />
    </>
  );
};
