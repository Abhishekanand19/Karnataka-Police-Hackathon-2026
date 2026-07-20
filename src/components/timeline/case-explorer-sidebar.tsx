"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, FileText, Pin, Bookmark, History, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TimelineCaseItem {
  id: string;
  number: string;
  title: string;
  district: string;
  status: string;
  pinned?: boolean;
}

export const mockTimelineCases: TimelineCaseItem[] = [
  { id: "c-491", number: "FIR-2026-00491", title: "₹4.2L Cyber Phishing Scam", district: "Bengaluru Urban", status: "Chargesheet Filed", pinned: true },
  { id: "c-488", number: "FIR-2026-00488", title: "Indiranagar Burglary Ring", district: "Bengaluru Urban", status: "Under Investigation", pinned: true },
  { id: "c-412", number: "FIR-2026-00412", title: "Devaraja Theft Network", district: "Mysuru City", status: "Suspect Arrested", pinned: false },
  { id: "c-388", number: "FIR-2026-00388", title: "Coastal Smuggling Racket", district: "Dakshina Kannada", status: "Under Investigation", pinned: false },
];

export interface CaseExplorerSidebarProps {
  selectedCaseId: string;
  onSelectCase: (c: TimelineCaseItem) => void;
}

export const CaseExplorerSidebar: React.FC<CaseExplorerSidebarProps> = ({
  selectedCaseId,
  onSelectCase,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = mockTimelineCases.filter(
    (c) =>
      c.number.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`relative bg-card border border-card-border rounded-xl shadow-xl flex flex-col transition-all duration-300 ${
        collapsed ? "w-14" : "w-full lg:w-72"
      }`}
    >
      {/* Header Bar */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <FileText className="w-4 h-4 text-primary" />
            <span>Case Explorer</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors ml-auto"
          title={collapsed ? "Expand Case Explorer" : "Collapse Case Explorer"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[540px] text-xs select-none">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Case ID or Title..."
              className="w-full bg-surface text-gray-100 border border-border rounded-input pl-8 pr-3 py-2 text-xs placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Pinned Cases */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Pin className="w-3 h-3 text-accent" /> Pinned Investigations
            </div>
            <div className="space-y-1.5">
              {filtered
                .filter((c) => c.pinned)
                .map((c) => {
                  const isSelected = c.id === selectedCaseId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCase(c)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-primary/15 border-primary shadow-md"
                          : "bg-surface/50 border-border hover:border-gray-500 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{c.number}</span>
                        <Badge variant="neutral" size="sm">{c.status}</Badge>
                      </div>
                      <div className="font-semibold text-white truncate">{c.title}</div>
                      <div className="text-[10px] text-gray-400">{c.district}</div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Recent Cases */}
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <History className="w-3 h-3 text-primary" /> All Recent Cases
            </div>
            <div className="space-y-1.5">
              {filtered
                .filter((c) => !c.pinned)
                .map((c) => {
                  const isSelected = c.id === selectedCaseId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCase(c)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-primary/15 border-primary shadow-md"
                          : "bg-surface/50 border-border hover:border-gray-500 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{c.number}</span>
                        <Badge variant="neutral" size="sm">{c.status}</Badge>
                      </div>
                      <div className="font-semibold text-white truncate">{c.title}</div>
                      <div className="text-[10px] text-gray-400">{c.district}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
