"use client";
import React from "react";
export const GraphLegend: React.FC = () => {
  const items = [["FIR", "#2563eb"], ["Suspect", "#ef4444"], ["Victim", "#ec4899"], ["Phone", "#f97316"], ["Bank account", "#8b5cf6"], ["Police station", "#64748b"], ["Vehicle", "#22c55e"]];
  return <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap"><span className="text-[10px] font-bold text-gray-400 uppercase">Legend</span>{items.map(([label, color]) => <div key={label} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: color }} /><span className="text-[11px] text-gray-300">{label}</span></div>)}</div>;
};
