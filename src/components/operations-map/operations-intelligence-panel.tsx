"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Crosshair, FileText, MapPin, Users, Activity } from "lucide-react";
import { FIR } from "@/lib/mock-database";

interface OperationsIntelligencePanelProps {
  activeFir: FIR;
  nearbyCases?: number;
  activeSuspects?: number;
  patrolRadiusKm?: number;
}

export const OperationsIntelligencePanel: React.FC<OperationsIntelligencePanelProps> = ({ activeFir, nearbyCases = 0, activeSuspects = activeFir.linkedSuspects.length, patrolRadiusKm = 2.5 }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#101827]/95 shadow-2xl backdrop-blur-xl">
      <div className="p-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-semantic-danger" /> Intelligence Panel
        </h2>
      </div>

      <div className="p-5 space-y-5">
        
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active FIR</h3>
          
          <div className="p-4 bg-card/40 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> {activeFir.firNumber}
                </div>
                <div className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {activeFir.station}
                </div>
              </div>
              <span className="px-3 py-1 bg-semantic-danger/20 text-semantic-danger text-xs font-bold uppercase rounded">
                {activeFir.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-black/40 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Category</span>
                <div className="flex items-center gap-2 text-sm text-white font-semibold truncate">
                  {activeFir.category}
                </div>
              </div>
              <div className="p-3 bg-black/40 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Threat Score</span>
                <div className="flex items-center gap-2 text-sm text-semantic-danger font-semibold">
                  <Activity className="w-4 h-4" /> {activeFir.riskScore}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/40 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Connected Suspects</span>
                <div className="flex items-center gap-2 text-sm text-white font-semibold">
                  <Users className="w-4 h-4 text-blue-400" /> {activeSuspects}
                </div>
              </div>
              <div className="p-3 bg-black/40 rounded-lg flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase">Nearby FIRs</span>
                <div className="flex items-center gap-2 text-sm text-white font-semibold">
                  <FileText className="w-4 h-4 text-primary" /> {nearbyCases}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-accent/10 rounded-xl mt-4">
              <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> AI Investigation Summary
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {activeFir.description}
              </p>
            </div>

          </div>

          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended patrol radius</h3>
            <div className="p-4 bg-accent/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crosshair className="w-6 h-6 text-accent" />
                <div>
                  <div className="text-base font-bold text-white">Recommended Patrol Radius</div>
                  <div className="text-sm text-gray-400">Target area: {patrolRadiusKm.toFixed(1)} km</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-accent/20">
                Deploy Units
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
