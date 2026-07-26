"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

export const MapFilters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-40">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 h-full bg-surface/80 border border-border/80 rounded-xl hover:bg-card transition-colors text-sm font-bold text-white"
      >
        <Filter className="w-4 h-4 text-primary" />
        Filters
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">District</label>
              <select className="w-full bg-[#0a0c14] border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                <option>All Districts</option>
                <option>Bengaluru City</option>
                <option>Mysuru</option>
                <option>Mangaluru</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Police Station</label>
              <select className="w-full bg-[#0a0c14] border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                <option>All Stations</option>
                <option>Indiranagar PS</option>
                <option>HSR Layout PS</option>
                <option>Koramangala PS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Level</label>
              <select className="w-full bg-[#0a0c14] border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none">
                <option>All Risk Levels</option>
                <option>Critical Only</option>
                <option>High & Critical</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-card hover:bg-card-hover border border-border rounded-lg text-sm text-white transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
