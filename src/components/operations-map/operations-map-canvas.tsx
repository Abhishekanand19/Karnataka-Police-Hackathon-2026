"use client";

import React, { useMemo } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB, Hotspot } from "@/lib/mock-database";
import { SharedMapboxMap } from "@/components/map/shared-mapbox-map";

interface OperationsMapCanvasProps {
  onMarkerClick: (hotspot: Hotspot) => void;
  selectedHotspot: Hotspot | null;
}

export const OperationsMapCanvas: React.FC<OperationsMapCanvasProps> = ({ onMarkerClick, selectedHotspot }) => {
  const { activeFir } = useInvestigation();

  const activeHotspot = useMemo(() => {
    return MOCK_DB.hotspots.find(h => h.policeStation === activeFir?.station);
  }, [activeFir]);

  return (
    <div className="relative w-full h-full">
      <SharedMapboxMap
        hotspots={activeHotspot ? [activeHotspot] : MOCK_DB.hotspots}
        selectedHotspot={selectedHotspot}
        activeHotspot={activeHotspot}
        activeFirNumber={activeFir?.firNumber}
        onMarkerClick={onMarkerClick}
        interactive={true}
        initialZoom={11}
      />
    </div>
  );
};
