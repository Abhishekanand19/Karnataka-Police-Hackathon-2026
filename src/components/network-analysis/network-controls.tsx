"use client";

import React, { useState } from "react";
import { Network, CreditCard, Phone, Download, ChevronDown } from "lucide-react";

interface NetworkControlsProps {
  graphMode: string;
  setGraphMode: (mode: string) => void;
  showLowPriority: boolean;
  setShowLowPriority: (value: boolean) => void;
  onExport: (type: "png" | "json") => void;
}

export const NetworkControls: React.FC<NetworkControlsProps> = ({ graphMode, setGraphMode, showLowPriority, setShowLowPriority, onExport }) => {
  const [showExport, setShowExport] = useState(false);

  const modes = [
    { name: "Investigation Network", icon: Network },
    { name: "Financial Flow", icon: CreditCard },
    { name: "Telecom Intelligence", icon: Phone },
  ];

  return (
    <div className="flex items-center gap-4">
      
      {/* Graph Modes Segmented Control */}
      <div className="flex items-center bg-black/50 border border-border/80 rounded-lg p-1">
        {modes.map(mode => {
          const Icon = mode.icon;
          const isActive = graphMode === mode.name;
          return (
            <button
              key={mode.name}
              onClick={() => setGraphMode(mode.name)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                isActive 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{mode.name}</span>
            </button>
          );
        })}
      </div>

      <label className="hidden lg:flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
        <input type="checkbox" checked={showLowPriority} onChange={event => setShowLowPriority(event.target.checked)} className="accent-primary" />
        Show supporting links
      </label>

      {/* Export Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowExport(!showExport)}
          className="flex items-center gap-2 px-4 py-1.5 bg-surface-hover border border-border rounded-lg text-sm font-bold text-white hover:bg-card transition-colors"
        >
          <Download className="w-4 h-4 text-primary" /> Export Graph
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {showExport && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border/80 rounded-xl shadow-2xl py-2 z-50">
            <button 
              onClick={() => { onExport("png"); setShowExport(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-primary/10 transition-colors"
            >
              Save as PNG Image
            </button>
            <button 
              onClick={() => { onExport("json"); setShowExport(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-primary/10 transition-colors"
            >
              Export JSON Data
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
