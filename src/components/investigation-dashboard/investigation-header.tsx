"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { format } from "date-fns";
import { UserCheck, Briefcase, MapPin, History, ChevronDown, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const InvestigationHeader: React.FC = () => {
  const { officer, activeInvestigation, recentInvestigations, setInvestigation } = useInvestigation();
  const [time, setTime] = useState<Date>(new Date());
  const [recentOpen, setRecentOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setRecentOpen(false); };
    if (recentOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [recentOpen]);

  if (!officer || !activeInvestigation) return null;

  const previous = recentInvestigations[0];
  const catOf = (entityId: string) => MOCK_DB.firs.find(f => f.firNumber === entityId)?.category || "FIR";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/15 border border-primary/30 rounded-xl text-primary shrink-0">
          <Briefcase className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="truncate">Active {activeInvestigation.type}: {activeInvestigation.entityId}</span>
            <Badge variant="danger" size="sm">Live</Badge>
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> {officer.name} ({officer.badgeId}) · {officer.role}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Investigation history — never lose context after switching */}
        {previous && (
          <button
            onClick={() => setInvestigation("FIR", catOf(previous.entityId), previous.entityId)}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/60 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:border-primary/40 transition-colors"
            title={`Back to ${previous.entityId}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {previous.entityId}
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setRecentOpen(o => !o)}
            disabled={recentInvestigations.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface/60 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <History className="w-3.5 h-3.5 text-primary" /> Recent
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${recentOpen ? "rotate-180" : ""}`} />
          </button>
          {recentOpen && recentInvestigations.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">Recent investigations</div>
              {recentInvestigations.map(inv => (
                <button
                  key={inv.entityId}
                  onClick={() => { setInvestigation("FIR", catOf(inv.entityId), inv.entityId); setRecentOpen(false); }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-card text-left transition-colors group"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary shrink-0" />
                    <span className="text-[13px] font-semibold text-white truncate">{inv.entityId}</span>
                  </span>
                  <span className="text-[10px] text-gray-500 truncate max-w-[90px]">{catOf(inv.entityId)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block h-8 w-px bg-border/60" />
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-white flex items-center justify-end gap-1"><MapPin className="w-4 h-4 text-primary" /> {officer.district}</div>
          <div className="text-xs text-gray-400 font-medium tabular-nums">{format(time, "HH:mm")} IST · {officer.station}</div>
        </div>
      </div>
    </div>
  );
};
