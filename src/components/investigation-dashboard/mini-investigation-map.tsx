"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { MapPin, ArrowUpRight } from "lucide-react";
import { FirLocationMap } from "@/components/investigation-dashboard/fir-location-map";

export const MiniInvestigationMap: React.FC = () => {
  const router = useRouter();
  const { activeFir } = useInvestigation();

  return (
    <div className="surface-panel flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-surface z-10">
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <MapPin className="w-5 h-5 text-primary" /> Incident Location
        </div>
        <button
          onClick={() => router.push("/map")}
          className="flex items-center gap-1.5 rounded-lg bg-card hover:bg-card-hover border border-border/70 px-2.5 py-1.5 text-[11px] font-semibold text-gray-300 hover:text-white transition-colors"
          title="Open the full operations map for hotspots, nearby FIRs and patrol analysis"
        >
          Hotspot Map <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative flex-1 min-h-[240px] overflow-hidden">
        {activeFir ? (
          <FirLocationMap key={activeFir.firNumber} fir={activeFir} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">No active investigation.</div>
        )}
      </div>
    </div>
  );
};
