"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { FileText, ArrowRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const RelatedCasesList: React.FC = () => {
  const router = useRouter();
  const { caseContext, setInvestigation } = useInvestigation();
  const relatedCases = (caseContext?.relatedFirs || []).map(fir => ({
    ...fir,
    similarity: Math.max(40, 99 - Math.abs(fir.riskScore - (caseContext?.fir.riskScore || 0))),
  })).sort((a, b) => b.similarity - a.similarity);

  if (relatedCases.length === 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center h-full">
        <FileText className="w-10 h-10 text-gray-500 mb-3" />
        <h3 className="text-white font-bold mb-1">No Related Cases</h3>
        <p className="text-sm text-gray-400">No other FIRs in the system share known suspects or MO.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <FileText className="w-5 h-5 text-primary" /> Related Cases
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {relatedCases.map(fir => (
          <div 
            key={fir.id}
            className="p-3 bg-card/20 border border-border/50 rounded-xl hover:bg-card/60 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-mono font-bold text-white group-hover:text-primary transition-colors">
                  {fir.firNumber}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{fir.district}</div>
              </div>
              <div className="text-right">
                <Badge variant={fir.status === "Closed" ? "neutral" : "danger"} size="sm">
                  {fir.status}
                </Badge>
                <div className="text-[10px] font-bold text-semantic-warning flex items-center justify-end gap-1 mt-1">
                  <Activity className="w-3 h-3" /> {fir.similarity}% Match
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-300 font-medium truncate mb-3">
              {fir.category}
            </div>
            
            <button
              onClick={() => setInvestigation("FIR", "FIR Record", fir.firNumber)}
              className="w-full py-1.5 px-3 bg-primary/10 hover:bg-primary border border-primary/30 hover:border-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              Switch Investigation <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
