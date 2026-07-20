import React from "react";
import { GitFork, ShieldAlert } from "lucide-react";
import { entityConfig, EntityType } from "./network-graph-canvas";

export const NetworkLegendControl: React.FC = () => {
  const nodeTypes: EntityType[] = [
    "Case",
    "Accused",
    "Victim",
    "PoliceStation",
    "PhoneNumber",
    "BankAccount",
    "Vehicle",
    "ModusOperandi",
  ];

  return (
    <div className="p-3 bg-card/90 border border-card-border rounded-xl shadow-xl backdrop-blur-md text-xs space-y-2 select-none">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
        <GitFork className="w-3.5 h-3.5 text-accent" /> Network Graph Legend
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        {nodeTypes.map((type) => {
          const cfg = entityConfig[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-gray-300 font-medium">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-border/50 space-y-1 text-[10px]">
        <div className="font-semibold text-gray-400 uppercase tracking-wider">Relationship Link Strength</div>
        <div className="flex items-center justify-between text-gray-300">
          <span className="text-semantic-danger font-bold">Critical (Thick Red)</span>
          <span className="text-primary font-semibold">Strong (Solid Blue)</span>
          <span className="text-semantic-warning">Medium</span>
          <span className="text-gray-400">Weak (Dashed)</span>
        </div>
      </div>
    </div>
  );
};
