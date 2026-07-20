import React from "react";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Shield, Flame } from "lucide-react";

export const MapLegendControl: React.FC = () => {
  return (
    <div className="p-3 bg-card/90 border border-card-border rounded-xl shadow-xl backdrop-blur-md text-xs space-y-2 select-none">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
        <Flame className="w-3.5 h-3.5 text-semantic-warning" /> Spatial Legend
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-semantic-danger animate-pulse" />
          <span className="text-gray-300 font-medium">Critical (&gt;85 Risk)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-risk-high" />
          <span className="text-gray-300 font-medium">High (70-84)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-semantic-warning" />
          <span className="text-gray-300 font-medium">Medium (50-69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-semantic-success" />
          <span className="text-gray-300 font-medium">Low (&lt;50 Risk)</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-primary" /> Sector Police Station
        </span>
        <span className="font-mono text-accent">Mapbox Vectors</span>
      </div>
    </div>
  );
};
