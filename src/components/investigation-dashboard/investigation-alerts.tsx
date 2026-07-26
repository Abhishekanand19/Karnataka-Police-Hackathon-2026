"use client";

import React, { useMemo } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const InvestigationAlerts: React.FC = () => {
  const { caseContext } = useInvestigation();

  const alerts = useMemo(() => {
    if (!caseContext) return [];
    const direct = MOCK_DB.emergingAlerts.filter(a => a.firId === caseContext.fir.firNumber);
    if (direct.length) return direct;
    return [
      { id: `risk-${caseContext.fir.id}`, title: `${caseContext.fir.riskScore >= 80 ? "High" : "Active"} case monitoring`, message: `${caseContext.fir.firNumber} remains ${caseContext.fir.status} in ${caseContext.fir.district}.`, type: "Alert", time: "Case context" },
      { id: `evidence-${caseContext.fir.id}`, title: "Evidence review required", message: `${caseContext.evidence.length} case-linked evidence item(s) are available for review.`, type: "Warning", time: "Case context" },
    ];
  }, [caseContext]);

  if (alerts.length === 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center h-full">
        <Bell className="w-10 h-10 text-gray-500 mb-3" />
        <h3 className="text-white font-bold mb-1">No Active Alerts</h3>
        <p className="text-sm text-gray-400">No new intelligence alerts for this investigation.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm bg-card/30">
        <Bell className="w-5 h-5 text-primary" /> Intelligence Alerts
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className="p-3 bg-card/20 border border-border/50 rounded-xl flex items-start gap-3"
          >
            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
              alert.type === "Critical" ? "bg-semantic-danger/20 text-semantic-danger" : 
              alert.type === "Warning" ? "bg-semantic-warning/20 text-semantic-warning" : 
              "bg-primary/20 text-primary"
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white truncate">{alert.title}</h4>
                <span className="text-[10px] text-gray-500 font-mono ml-2">{alert.time}</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
