"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Hotspot } from "@/lib/mock-database";
import { AlertTriangle, MapPin, LocateFixed, Activity, RefreshCw } from "lucide-react";

interface SharedMapboxMapProps {
  hotspots: Hotspot[];
  selectedHotspot?: Hotspot | null;
  activeHotspot?: Hotspot | null;
  activeFirNumber?: string;
  onMarkerClick?: (hotspot: Hotspot) => void;
  interactive?: boolean;
  initialZoom?: number;
  initialCenter?: [number, number]; // [lng, lat]
  showHeatmap?: boolean;
  showMarkers?: boolean;
  showJurisdiction?: boolean;
}

export const SharedMapboxMap: React.FC<SharedMapboxMapProps> = ({
  hotspots,
  selectedHotspot,
  activeHotspot,
  activeFirNumber,
  onMarkerClick,
  interactive = true,
  initialZoom = 11,
  initialCenter = [77.6446, 12.9121], // Bengaluru HSR default [lng, lat]
  showHeatmap = true,
  showMarkers = true,
  showJurisdiction = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Prevent double init

    if (!token) {
      setMapError("NEXT_PUBLIC_MAPBOX_TOKEN is missing in environment variables.");
      return;
    }

    try {
      mapboxgl.accessToken = token;

      // Determine starting center from active/selected hotspot if available
      const startCenter = selectedHotspot
        ? [selectedHotspot.lng, selectedHotspot.lat]
        : activeHotspot
        ? [activeHotspot.lng, activeHotspot.lat]
        : initialCenter;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: startCenter as [number, number],
        zoom: initialZoom,
        interactive: interactive,
        attributionControl: false,
      });

      if (interactive) {
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
        map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      }

      mapRef.current = map;

      // Handle load event
      map.on("load", () => {
        setMapLoaded(true);
        map.resize();

        // Add source for jurisdiction radius
        map.addSource("jurisdiction-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        // Add heat/jurisdiction radius layer
        map.addLayer({
          id: "jurisdiction-radius",
          type: "circle",
          source: "jurisdiction-source",
          paint: {
            "circle-radius": 80,
            "circle-color": "#f59e0b",
            "circle-opacity": 0.15,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#f59e0b",
          },
        });
      });

      // Handle errors (e.g. invalid token, style load failure, network failure)
      map.on("error", (e) => {
        console.error("Mapbox GL Error:", e);
        // Only trigger critical error UI if map fails to load tile style
        if (e.error && (e.error.message?.includes("Forbidden") || e.error.message?.includes("Unauthorized") || e.error.message?.includes("Invalid Token"))) {
          setMapError(`Mapbox Authentication Failed: ${e.error.message}`);
        }
      });

      // Handle window resize
      const handleResize = () => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err: any) {
      console.error("Mapbox initialization error:", err);
      setMapError(err.message || "Failed to initialize Mapbox instance.");
    }
  }, []);

  // Update Markers on Map when hotspots or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Update Jurisdiction Radius Layer
    if (map.getSource("jurisdiction-source")) {
      const source = map.getSource("jurisdiction-source") as mapboxgl.GeoJSONSource;
      if (activeHotspot && showJurisdiction) {
        source.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [activeHotspot.lng, activeHotspot.lat],
              },
            },
          ],
        });
      } else {
        source.setData({ type: "FeatureCollection", features: [] });
      }
    }

    // Add new markers
    if (showMarkers) {
    hotspots.forEach((hotspot) => {
      const isSelected = selectedHotspot?.id === hotspot.id;
      const isActiveInvestigation = activeHotspot?.id === hotspot.id;
      const isCritical = hotspot.risk === "Critical";

      // Create custom marker DOM element
      const el = document.createElement("div");
      el.className = "cursor-pointer group relative flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2";
      
      const pinColor = isSelected ? "#3b82f6" : isActiveInvestigation ? "#f59e0b" : isCritical ? "#ef4444" : "#64748b";
      const badgeText = isSelected ? "SELECTED" : isActiveInvestigation ? "ACTIVE CASE" : hotspot.risk.toUpperCase();

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${isCritical || isActiveInvestigation ? `<div class="absolute -inset-3 rounded-full animate-ping opacity-40" style="background-color: ${pinColor}"></div>` : ""}
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-xl transition-all transform ${isSelected ? "scale-125 border-white" : "hover:scale-110"}" style="background-color: rgba(15, 23, 42, 0.9); border-color: ${pinColor}; text-color: ${pinColor}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${pinColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="mt-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono text-white bg-slate-950/90 border border-slate-700 shadow-md whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
            ${hotspot.policeStation} • <span style="color: ${pinColor}">${badgeText}</span>
          </div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onMarkerClick) {
          onMarkerClick(hotspot);
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([hotspot.lng, hotspot.lat])
        .addTo(map);

      markersRef.current[hotspot.id] = marker;
    });
    }
  }, [mapLoaded, hotspots, selectedHotspot, activeHotspot, showMarkers, showJurisdiction]);

  // Center camera on selected or active hotspot
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const target = selectedHotspot || activeHotspot;
    if (target) {
      map.flyTo({
        center: [target.lng, target.lat],
        zoom: 13,
        duration: 1200,
        essential: true,
      });
    }
  }, [selectedHotspot, activeHotspot, mapLoaded]);

  return (
    <div className="relative w-full h-full bg-[#05070D] rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
      {/* Mapbox Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0" 
      />

      {/* Mapbox Initialization Error Overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-[#070913]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50">
          <div className="p-3 rounded-full bg-semantic-danger/20 border border-semantic-danger/40 text-semantic-danger mb-3">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Mapbox Initialization Issue</h3>
          <p className="text-xs text-gray-400 max-w-md mb-4 font-mono">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Map Engine
          </button>
        </div>
      )}

      {/* Map Controls & Status Overlay */}
      {!mapError && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl shadow-lg pointer-events-auto">
            <LocateFixed className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Karnataka Spatial Command</span>
          </div>

          {activeFirNumber && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 border border-accent/40 rounded-xl shadow-lg pointer-events-auto">
              <Activity className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Tracking: {activeFirNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer Attribution Badge */}
      {!mapError && (
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-surface/80 backdrop-blur-md border border-border/60 rounded-lg pointer-events-none z-10 text-[10px] text-gray-400 font-mono">
          Mapbox Vector GL • Dark-v11 • Karnataka SCRB
        </div>
      )}
    </div>
  );
};
