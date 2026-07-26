"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { 
  History, ArrowLeft, Bot, CheckCircle2, Circle, Clock, ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const InvestigationSummarySidebar: React.FC = () => {
  const router = useRouter();
  const { activeInvestigation } = useInvestigation();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fir = useMemo(() => {
    return MOCK_DB.firs.find(f => f.firNumber === activeInvestigation?.entityId);
  }, [activeInvestigation]);

  if (!activeInvestigation || !fir) {
    return (
      <div className="flex flex-col h-full bg-surface border-r border-border/80 shadow-2xl p-6 items-center justify-center text-center">
        <History className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-white font-bold mb-2">No Investigation Selected</h3>
        <p className="text-sm text-gray-400 mb-6">Select an investigation to replay its timeline.</p>
        <button 
          onClick={() => router.push("/workspace")}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Workspace
        </button>
      </div>
    );
  }

  const milestones = [
    { name: "Complaint Received", completed: true },
    { name: "Investigation Started", completed: true },
    { name: "Evidence Collection", completed: true },
    { name: "Suspect Tracking", completed: true },
    { name: "Arrest", completed: fir.status === "Suspect Arrested" || fir.status === "Closed" },
    { name: "Chargesheet", completed: fir.status === "Chargesheet Submitted" || fir.status === "Closed" },
    { name: "Court Proceedings", completed: fir.status === "Closed" },
  ];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border/80 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 pb-5 bg-card/30">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-white">Case replay</span>
        </div>
        <h2 className="text-xl font-semibold text-white tracking-tight">{fir.firNumber}</h2>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant={fir.status === "Closed" ? "neutral" : "danger"} size="sm">{fir.status}</Badge>
          <Badge variant={fir.riskScore > 80 ? "danger" : "warning"} size="sm">{fir.riskScore} Risk Score</Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-7">
        
        {/* Case Meta */}
        <div>
          <div className="grid grid-cols-1 gap-4 text-[15px]">
            <div>
              <div className="text-xs text-gray-400 mb-1">Crime type</div>
              <div className="font-semibold text-gray-100">{fir.category}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Police station</div>
              <div className="font-semibold text-gray-100">{fir.station}</div>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl overflow-hidden">
          <button onClick={() => setSummaryOpen(open => !open)} className="w-full flex items-center justify-between p-3.5 text-sm font-semibold text-primary">
            <span className="flex items-center gap-2"><Bot className="w-4 h-4" /> AI case summary</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} />
          </button>
          {summaryOpen && <p className="px-4 pb-4 text-[15px] leading-6 text-gray-200">{fir.description} The timeline shows the progression from complaint to evidence recovery.</p>}
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-200">Progress tracker</h3>
          <div className="space-y-0 relative">
            {/* Connecting line */}
            <div className="absolute left-[9px] top-3 bottom-3 w-[2px] bg-border/50" />
            
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-3 relative py-2.5">
                <div className="bg-surface relative z-10">
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-semantic-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span className={`text-[15px] font-medium ${milestone.completed ? "text-gray-100" : "text-gray-500"}`}>
                  {milestone.name}
                </span>
                {idx === milestones.findIndex(m => !m.completed) && (
                  <span className="ml-auto text-xs font-semibold text-semantic-warning flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-card/30">
        <button 
          onClick={() => router.push("/workspace")}
          className="w-full py-2 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-bold text-white transition-colors"
        >
          Change Investigation
        </button>
      </div>

    </div>
  );
};
