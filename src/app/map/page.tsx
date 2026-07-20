"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpatialMapCanvas, mockHotspots, HotspotPoint } from "@/components/map/spatial-map-canvas";
import { MapFilterPanel, MapFilterState } from "@/components/map/map-filter-panel";
import { HotspotIntelligencePanel } from "@/components/map/hotspot-intelligence-panel";
import { SpatialTimelineSlider } from "@/components/map/spatial-timeline-slider";
import { LocationIntelligenceDrawer } from "@/components/map/location-intelligence-drawer";
import { MapSearchBar } from "@/components/map/map-search-bar";
import { MapLegendControl } from "@/components/map/map-legend-control";
import { MapPin, Layers, RefreshCw, Sparkles, Filter } from "lucide-react";

export default function MapPage() {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPoint | null>(mockHotspots[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapFilters, setMapFilters] = useState<MapFilterState>({
    district: "all",
    policeStation: "all",
    category: "all",
    risk: "all",
    status: "all",
    dateRange: "30d",
    heatmapOpacity: 0.8,
  });

  // Filter hotspots based on selected filters
  const filteredHotspots = mockHotspots.filter((item) => {
    if (mapFilters.district !== "all" && item.district !== mapFilters.district) return false;
    if (mapFilters.risk !== "all" && item.risk !== mapFilters.risk) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Page Header */}
      <PageHeader
        title="Hotspot Intelligence & Spatial Analytics"
        description="Vector geospatial workspace for Karnataka State Police SCRB. Interactive hotspot cluster detection, district boundaries, and density heatmaps."
        badge={
          <Badge variant="accent">
            <Layers className="w-3.5 h-3.5 mr-1" /> Mapbox Vector Layer
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <MapSearchBar onSelectResult={(hotspot) => setSelectedHotspot(hotspot)} />
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => setSelectedHotspot(mockHotspots[0])}
            >
              Reset Center
            </Button>
          </div>
        }
      />

      {/* 4-Quadrant Spatial Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start relative">
        {/* Left Filter Panel */}
        <MapFilterPanel onFilterChange={(f) => setMapFilters(f)} />

        {/* Center Spatial Map Area */}
        <div className="flex-1 w-full space-y-4">
          <div className="relative">
            <SpatialMapCanvas
              selectedHotspot={selectedHotspot}
              onSelectHotspot={(h) => setSelectedHotspot(h)}
              filteredHotspots={filteredHotspots}
              heatmapOpacity={mapFilters.heatmapOpacity}
            />

            {/* Bottom Left Overlay: Map Legend Control */}
            <div className="absolute bottom-4 left-4 z-20 hidden md:block">
              <MapLegendControl />
            </div>
          </div>

          {/* Bottom Spatial Timeline Slider */}
          <SpatialTimelineSlider />
        </div>

        {/* Right Intelligence Panel */}
        <HotspotIntelligencePanel
          hotspot={selectedHotspot}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
      </div>

      {/* Bottom Location Intelligence Dossier Drawer */}
      <LocationIntelligenceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hotspot={selectedHotspot}
      />
    </div>
  );
}
