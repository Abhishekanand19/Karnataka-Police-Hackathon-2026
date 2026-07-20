"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Bot, Bookmark, History, Pin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SessionItem {
  id: string;
  title: string;
  date: string;
  pinned?: boolean;
}

export const mockSessions: SessionItem[] = [
  { id: "sess-01", title: "Bengaluru Urban Cyber Surge Brief", date: "Today 16:20 IST", pinned: true },
  { id: "sess-02", title: "Indiranagar Burglary Hotspot Assessment", date: "Today 11:45 IST", pinned: true },
  { id: "sess-03", title: "Mysuru Theft Network Relationship Synthesis", date: "Yesterday", pinned: false },
  { id: "sess-04", title: "Coastal Smuggling Repeat Offender Analysis", date: "15 July 2026", pinned: false },
];

export interface CopilotSidebarProps {
  selectedSessionId: string;
  onSelectSession: (session: SessionItem) => void;
  onNewSession?: () => void;
}

export const CopilotSidebar: React.FC<CopilotSidebarProps> = ({
  selectedSessionId,
  onSelectSession,
  onNewSession,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const filteredSessions = mockSessions.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
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
            <Bot className="w-4 h-4 text-accent" />
            <span>AI Sessions</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors ml-auto"
          title={collapsed ? "Expand Sessions" : "Collapse Sessions"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[540px] text-xs select-none">
          {/* New Session Button */}
          <Button
            variant="primary"
            fullWidth
            size="sm"
            onClick={onNewSession}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New AI Investigation
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search past briefings..."
              className="w-full bg-surface text-gray-100 border border-border rounded-input pl-8 pr-3 py-2 text-xs placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Pinned Investigations */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Pin className="w-3 h-3 text-accent" /> Pinned Investigations
            </div>
            <div className="space-y-1.5">
              {filteredSessions
                .filter((s) => s.pinned)
                .map((session) => {
                  const isSelected = session.id === selectedSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-primary/15 border-primary shadow-md"
                          : "bg-surface/50 border-border hover:border-gray-500 hover:bg-surface"
                      }`}
                    >
                      <div className="font-semibold text-white truncate">{session.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{session.date}</div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Recent History */}
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <History className="w-3 h-3 text-primary" /> Recent AI Briefings
            </div>
            <div className="space-y-1.5">
              {filteredSessions
                .filter((s) => !s.pinned)
                .map((session) => {
                  const isSelected = session.id === selectedSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-primary/15 border-primary shadow-md"
                          : "bg-surface/50 border-border hover:border-gray-500 hover:bg-surface"
                      }`}
                    >
                      <div className="font-semibold text-white truncate">{session.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{session.date}</div>
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
