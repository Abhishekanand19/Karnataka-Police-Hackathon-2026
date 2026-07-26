"use client";

import React, { useMemo } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { ListChecks, AlertCircle } from "lucide-react";

export const RecommendedActions: React.FC = () => {
  const { activeInvestigation } = useInvestigation();

  const actions = useMemo(() => {
    return MOCK_DB.actionQueue.filter(a => a.firId === activeInvestigation?.entityId);
  }, [activeInvestigation]);

  if (actions.length === 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center h-full">
        <ListChecks className="w-10 h-10 text-gray-500 mb-3" />
        <h3 className="text-white font-bold mb-1">No Pending Actions</h3>
        <p className="text-sm text-gray-400">All recommended operational tasks are complete.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm bg-card/30">
        <ListChecks className="w-5 h-5 text-primary" /> Recommended Actions
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {actions.map(action => (
          <div 
            key={action.id}
            className="p-3 bg-card/20 border border-border/50 rounded-xl hover:bg-card/40 transition-colors flex items-start gap-3"
          >
            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
              action.priority === "High" ? "bg-semantic-danger/20 text-semantic-danger" : 
              action.priority === "Medium" ? "bg-semantic-warning/20 text-semantic-warning" : 
              "bg-primary/20 text-primary"
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white mb-1 truncate">{action.title}</h4>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold ${
                  action.priority === "High" ? "text-semantic-danger" : 
                  action.priority === "Medium" ? "text-semantic-warning" : 
                  "text-primary"
                }`}>{action.priority}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 font-mono">Due: {action.deadline}</span>
              </div>
            </div>
            
            <button className="px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-white transition-colors shrink-0">
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
