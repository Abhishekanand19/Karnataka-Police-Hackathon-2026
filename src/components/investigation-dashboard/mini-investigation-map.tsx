"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { Map as MapIcon, Maximize2 } from "lucide-react";
import { SharedMapboxMap } from "@/components/map/shared-mapbox-map";

export const MiniInvestigationMap: React.FC = () => {
  const router = useRouter();
  const { activeFir } = useInvestigation();

  const activeHotspot = useMemo(() => {
    return MOCK_DB.hotspots.find(h => h.policeStation === activeFir?.station) || MOCK_DB.hotspots.find(h => h.district === activeFir?.district);
  }, [activeFir]);

  return (
    <div className="bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between z-10 bg-surface">
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <MapIcon className="w-5 h-5 text-primary" /> Area of Operations
        </div>
        <button 
          onClick={() => router.push("/map")}
          className="p-1.5 bg-card hover:bg-card-hover rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Open Full Map"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div 
        className="flex-1 relative cursor-pointer group min-h-[220px]"
        onClick={() => router.push("/map")}
      >
        <SharedMapboxMap
          hotspots={activeHotspot ? [activeHotspot] : MOCK_DB.hotspots}
          activeHotspot={activeHotspot}
          activeFirNumber={activeFir?.firNumber}
          interactive={false}
          initialZoom={12}
        />
      </div>
    </div>
  );
};
