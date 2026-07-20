"use client";

import React, { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { mockHotspots, HotspotPoint } from "./spatial-map-canvas";

export interface MapSearchBarProps {
  onSelectResult: (hotspot: HotspotPoint) => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSelectResult }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = query.trim()
    ? mockHotspots.filter(
        (h) =>
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.district.toLowerCase().includes(query.toLowerCase()) ||
          h.policeStation.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-full max-w-sm select-none">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Karnataka District or Station..."
          className="w-full bg-card/90 text-gray-100 border border-border rounded-xl pl-9 pr-8 py-2 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-lg backdrop-blur-md"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 p-1 text-gray-400 hover:text-white rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Results */}
      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-slate-900/95 border border-border rounded-xl shadow-2xl overflow-hidden text-xs divide-y divide-border/40 backdrop-blur-md max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectResult(item);
                setQuery(item.name);
                setIsFocused(false);
              }}
              className="p-2.5 hover:bg-surface/80 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span>{item.name}</span>
                </div>
                <div className="text-[11px] text-gray-400">{item.district} • {item.policeStation}</div>
              </div>
              <span className="font-mono text-[10px] text-primary">{item.cases} FIRs</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
