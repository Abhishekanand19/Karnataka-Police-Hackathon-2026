"use client";

import React, { useEffect, useState } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { CaseTask, getCaseTasks, toggleCaseTask, removeCaseTask, onCaseTasksChanged } from "@/lib/case-tasks";
import { ClipboardCheck, Circle, CheckCircle2, X } from "lucide-react";

export const CaseTasks: React.FC = () => {
  const { activeFir } = useInvestigation();
  const firNumber = activeFir?.firNumber;
  const [tasks, setTasks] = useState<CaseTask[]>([]);

  useEffect(() => {
    if (!firNumber) return;
    const refresh = () => setTasks(getCaseTasks(firNumber));
    refresh();
    return onCaseTasksChanged(refresh);
  }, [firNumber]);

  const openCount = tasks.filter(t => t.status === "open").length;

  return (
    <div className="surface-panel flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <ClipboardCheck className="w-5 h-5 text-primary" /> Case Tasks
        </div>
        {tasks.length > 0 && (
          <span className="text-[11px] font-semibold text-gray-400 tabular-nums">{openCount} open</span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <ClipboardCheck className="w-9 h-9 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400">No tasks assigned yet.</p>
          <p className="text-xs text-gray-500 mt-1">Use <span className="text-gray-300 font-semibold">Assign Task</span> in the AI Copilot to queue actions here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {tasks.map(task => (
            <div key={task.id} className="group flex items-start gap-2.5 p-2.5 bg-card/20 border border-border/50 rounded-xl">
              <button onClick={() => firNumber && toggleCaseTask(firNumber, task.id)} className="mt-0.5 shrink-0" title={task.status === "done" ? "Reopen" : "Mark done"}>
                {task.status === "done"
                  ? <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  : <Circle className="w-4 h-4 text-gray-500 hover:text-primary transition-colors" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-snug ${task.status === "done" ? "text-gray-500 line-through" : "text-gray-100"}`}>{task.label}</p>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">from {task.source}</span>
              </div>
              <button onClick={() => firNumber && removeCaseTask(firNumber, task.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-semantic-danger transition-all shrink-0 mt-0.5" title="Remove">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
