"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Maximize2,
  Eye,
  EyeOff,
  Download,
  Share2,
  GitFork,
  MapPin,
  CreditCard,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NetworkToolbarControlsProps {
  onFitGraph?: () => void;
  onReset?: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

export const NetworkToolbarControls: React.FC<NetworkToolbarControlsProps> = ({
  onFitGraph,
  onReset,
  showLabels,
  onToggleLabels,
}) => {
  const [activeTab, setActiveTab] = useState<"relationship" | "geo" | "financial" | "comm">(
    "relationship"
  );

  const tabs = [
    { id: "relationship", label: "Relationship View", icon: GitFork, active: true },
    { id: "geo", label: "Geographic View", icon: MapPin, active: false },
    { id: "financial", label: "Financial Flow", icon: CreditCard, active: false },
    { id: "comm", label: "Telecom Matrix", icon: PhoneCall, active: false },
  ];

  return (
    <div className="p-3 bg-surface/80 border border-border rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Investigation Mode Tabs */}
      <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-surface"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {!tab.active && (
                <span className="text-[9px] bg-surface text-gray-500 px-1 rounded">Soon</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleLabels}
          icon={showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        >
          {showLabels ? "Hide Labels" : "Show Labels"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onFitGraph}
          icon={<Maximize2 className="w-3.5 h-3.5" />}
        >
          Fit Graph
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert("Exporting Network Graph Image...")}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Export Graph
        </Button>
      </div>
    </div>
  );
};
