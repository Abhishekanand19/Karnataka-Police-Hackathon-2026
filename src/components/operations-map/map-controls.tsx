"use client";

import React from "react";
import { Layers, Eye, EyeOff } from "lucide-react";

interface MapControlsProps {
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  showMarkers: boolean;
  setShowMarkers: (v: boolean) => void;
  showJurisdiction: boolean;
  setShowJurisdiction: (v: boolean) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  showHeatmap, setShowHeatmap,
  showMarkers, setShowMarkers,
  showJurisdiction, setShowJurisdiction
}) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" /> Layer Controls & Legend
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Heatmap Toggle */}
        <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">Heatmap</span>
            <button onClick={() => setShowHeatmap(!showHeatmap)} className="text-gray-400 hover:text-white transition-colors">
              {showHeatmap ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full opacity-70" />
          <span className="text-[10px] text-gray-500 flex justify-between">
            <span>Low Risk</span><span>High Risk</span>
          </span>
        </div>

        {/* Markers Toggle */}
        <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">Entity Markers</span>
            <button onClick={() => setShowMarkers(!showMarkers)} className="text-gray-400 hover:text-white transition-colors">
              {showMarkers ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
            <span className="text-xs text-gray-300">Suspect Locations</span>
          </div>
        </div>

        {/* Jurisdiction Toggle */}
        <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase">Jurisdiction</span>
            <button onClick={() => setShowJurisdiction(!showJurisdiction)} className="text-gray-400 hover:text-white transition-colors">
              {showJurisdiction ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <div className="w-3 h-3 rounded-full bg-orange-500/20 border-2 border-orange-500" />
            <span className="text-xs text-gray-300">2.5km Patrol Radius</span>
          </div>
        </div>
      </div>
    </div>
  );
};
