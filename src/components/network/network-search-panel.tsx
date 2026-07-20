"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, GitFork, Shield, Users, Layers, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface InvestigationPreset {
  id: string;
  name: string;
  district: string;
  category: string;
  nodesCount: number;
  risk: "Critical" | "High" | "Medium";
}

export const mockPresets: InvestigationPreset[] = [
  { id: "INV-BC-804", name: "Bengaluru Cyber Syndicate #BC-804", district: "Bengaluru Urban", category: "Cyber Crime", nodesCount: 10, risk: "Critical" },
  { id: "INV-IT-201", name: "Indiranagar Theft Ring #IT-201", district: "Bengaluru Urban", category: "Property Theft", nodesCount: 8, risk: "High" },
  { id: "INV-CS-109", name: "Coastal Smuggling Gang #CS-109", district: "Dakshina Kannada", category: "Smuggling", nodesCount: 7, risk: "High" },
  { id: "INV-BB-302", name: "Belagavi Border Transport Theft", district: "Belagavi", category: "Vehicle Theft", nodesCount: 6, risk: "Medium" },
];

export interface NetworkSearchPanelProps {
  selectedPresetId: string;
  onSelectPreset: (preset: InvestigationPreset) => void;
  onSearchQuery?: (query: string) => void;
}

export const NetworkSearchPanel: React.FC<NetworkSearchPanelProps> = ({
  selectedPresetId,
  onSelectPreset,
  onSearchQuery,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const quickFilterChips = [
    { id: "all", label: "All Cases" },
    { id: "repeat", label: "Repeat Offenders" },
    { id: "gang", label: "Gang Activity" },
    { id: "cyber", label: "Cyber Crime" },
    { id: "financial", label: "Financial Crime" },
    { id: "high_risk", label: "High Risk" },
  ];

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
            <Search className="w-4 h-4 text-primary" />
            <span>Investigation Search</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors ml-auto"
          title={collapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[540px] text-xs">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (onSearchQuery) onSearchQuery(e.target.value);
              }}
              placeholder="Search Case ID, Accused, Phone..."
              className="w-full bg-surface text-gray-100 border border-border rounded-input pl-8 pr-3 py-2 text-xs placeholder-gray-500 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Quick Filters */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
              <Filter className="w-3 h-3 text-primary" /> Quick Filters
            </div>
            <div className="flex flex-wrap gap-1">
              {quickFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setActiveFilter(chip.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeFilter === chip.id
                      ? "bg-primary text-white"
                      : "bg-surface border border-border text-gray-400 hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Investigation Presets List */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-accent" /> Preset Networks ({mockPresets.length})
            </div>

            <div className="space-y-2">
              {mockPresets.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-primary/15 border-primary shadow-lg"
                        : "bg-surface/50 border-border hover:border-gray-500 hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-[160px]">
                        {preset.name}
                      </span>
                      <Badge
                        variant={preset.risk === "Critical" ? "danger" : "warning"}
                        size="sm"
                      >
                        {preset.risk}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center justify-between">
                      <span>{preset.district}</span>
                      <span className="font-mono text-primary">{preset.nodesCount} Nodes</span>
                    </div>
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
