"use client";

import React, { useState, useEffect, useRef } from "react";
import { RiskLevel } from "@/components/ui/risk-badge";
import { ZoomIn, ZoomOut, RotateCcw, Compass, Maximize2, ShieldAlert, MapPin, Layers } from "lucide-react";

export interface HotspotPoint {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  riskScore: number;
  cases: number;
  policeStation: string;
  topCrime: string;
  trend: string;
  repeatOffenders: number;
  openCases: number;
  solvedRate: string;
}

export const mockHotspots: HotspotPoint[] = [
  { id: "HS-01", name: "Indiranagar Property Theft Zone", district: "Bengaluru Urban", lat: 12.9716, lng: 77.5946, risk: "Critical", riskScore: 89, cases: 4120, policeStation: "Indiranagar PS", topCrime: "Cyber Fraud & Theft", trend: "+8.4%", repeatOffenders: 184, openCases: 1240, solvedRate: "69.9%" },
  { id: "HS-02", name: "Devaraja Market Theft Cluster", district: "Mysuru City", lat: 12.2958, lng: 76.6394, risk: "High", riskScore: 78, cases: 1850, policeStation: "Devaraja PS", topCrime: "Organized Theft", trend: "+4.1%", repeatOffenders: 92, openCases: 480, solvedRate: "74.0%" },
  { id: "HS-03", name: "Panambur Coastal Smuggling Belt", district: "Dakshina Kannada", lat: 12.9141, lng: 74.8560, risk: "High", riskScore: 72, cases: 1420, policeStation: "Panambur PS", topCrime: "Smuggling & Drugs", trend: "-1.2%", repeatOffenders: 64, openCases: 390, solvedRate: "72.5%" },
  { id: "HS-04", name: "Belagavi Border Transport Zone", district: "Belagavi", lat: 15.8497, lng: 74.4977, risk: "Medium", riskScore: 58, cases: 980, policeStation: "Belagavi Town PS", topCrime: "Vehicle Theft", trend: "+2.0%", repeatOffenders: 38, openCases: 240, solvedRate: "75.5%" },
  { id: "HS-05", name: "Hubballi Railway Hub Cluster", district: "Hubballi-Dharwad", lat: 15.3647, lng: 75.1240, risk: "Medium", riskScore: 54, cases: 840, policeStation: "Hubballi City PS", topCrime: "Pickpocketing & Theft", trend: "-0.5%", repeatOffenders: 29, openCases: 190, solvedRate: "77.3%" },
  { id: "HS-06", name: "Kalaburagi Supermarket Area", district: "Kalaburagi", lat: 17.3297, lng: 76.8343, risk: "Medium", riskScore: 51, cases: 760, policeStation: "Kalaburagi Central PS", topCrime: "Property Theft", trend: "+1.8%", repeatOffenders: 24, openCases: 180, solvedRate: "76.3%" },
  { id: "HS-07", name: "Tumakuru Industrial Belt", district: "Tumakuru", lat: 13.3379, lng: 77.1173, risk: "Low", riskScore: 42, cases: 620, policeStation: "Tumakuru Town PS", topCrime: "Factory Burglary", trend: "-3.1%", repeatOffenders: 18, openCases: 110, solvedRate: "82.2%" },
  { id: "HS-08", name: "Ballari Mining Region", district: "Ballari", lat: 15.1394, lng: 76.9214, risk: "Low", riskScore: 39, cases: 590, policeStation: "Ballari Rural PS", topCrime: "Illegal Mining & Theft", trend: "-2.4%", repeatOffenders: 15, openCases: 95, solvedRate: "83.8%" },
  { id: "HS-09", name: "Shivamogga Bus Stand Zone", district: "Shivamogga", lat: 13.9299, lng: 75.5681, risk: "Low", riskScore: 36, cases: 510, policeStation: "Shivamogga East PS", topCrime: "Assault", trend: "-1.1%", repeatOffenders: 12, openCases: 80, solvedRate: "84.3%" },
  { id: "HS-10", name: "Udupi Temple Road Area", district: "Udupi", lat: 13.3409, lng: 74.7421, risk: "Low", riskScore: 32, cases: 480, policeStation: "Udupi Town PS", topCrime: "Chain Snatching", trend: "-4.0%", repeatOffenders: 9, openCases: 65, solvedRate: "86.4%" },
];

export interface SpatialMapCanvasProps {
  selectedHotspot: HotspotPoint | null;
  onSelectHotspot: (hotspot: HotspotPoint) => void;
  filteredHotspots?: HotspotPoint[];
  heatmapOpacity?: number;
}

export const SpatialMapCanvas: React.FC<SpatialMapCanvasProps> = ({
  selectedHotspot,
  onSelectHotspot,
  filteredHotspots = mockHotspots,
  heatmapOpacity = 0.8,
}) => {
  const [zoom, setZoom] = useState(7.2);
  const [pitch, setPitch] = useState(30);
  const [bearing, setBearing] = useState(-10);
  const [hoveredPoint, setHoveredPoint] = useState<HotspotPoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG coordinate transformation helper for Karnataka bounding box (Lng 74° to 78.5°, Lat 11.5° to 18.5°)
  const projectCoords = (lat: number, lng: number) => {
    const minLng = 73.8;
    const maxLng = 78.6;
    const minLat = 11.4;
    const maxLat = 18.6;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 12));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.5, 5));
  const handleResetView = () => {
    setZoom(7.2);
    setPitch(30);
    setBearing(-10);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] bg-[#070D18] rounded-xl border border-card-border overflow-hidden select-none shadow-2xl flex flex-col justify-between"
    >
      {/* Background Vector Grid & Karnataka Boundary Visualizer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Map Status Overlay */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg shadow-lg pointer-events-auto">
          <MapPin className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Karnataka Crime Intelligence Mapbox Viewport
          </span>
          <span className="text-[10px] font-mono text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/30">
            Zoom {zoom.toFixed(1)}°
          </span>
        </div>

        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono text-gray-300 pointer-events-auto">
          <span>Pitch: {pitch}°</span>
          <span>Bearing: {bearing}°</span>
        </div>
      </div>

      {/* Interactive Map Vector Layer */}
      <div className="relative w-full h-full flex-1 flex items-center justify-center p-6">
        <div
          className="relative w-full h-full max-w-4xl transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom / 7}) rotate(${bearing}deg) rotateX(${pitch}deg)`,
            transformOrigin: "center center",
          }}
        >
          {/* Karnataka State Boundary Polyline Placeholder */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none opacity-40">
            <path
              d="M 20% 85% L 15% 70% L 10% 50% L 20% 30% L 35% 15% L 60% 10% L 85% 20% L 90% 40% L 80% 65% L 65% 85% L 45% 95% Z"
              fill="rgba(37, 99, 235, 0.05)"
              stroke="#2563EB"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Density Heatmap Glow Layer */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" style={{ opacity: heatmapOpacity }}>
            {filteredHotspots.map((pt) => {
              const { x, y } = projectCoords(pt.lat, pt.lng);
              const heatColors = {
                Critical: "#EF4444",
                High: "#F97316",
                Medium: "#F59E0B",
                Low: "#22C55E",
              };
              return (
                <circle
                  key={`heat-${pt.id}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={pt.risk === "Critical" ? "65" : pt.risk === "High" ? "50" : "35"}
                  fill={heatColors[pt.risk]}
                  opacity={0.25}
                  className="blur-xl"
                />
              );
            })}
          </svg>

          {/* Interactive Hotspot Points */}
          {filteredHotspots.map((pt) => {
            const { x, y } = projectCoords(pt.lat, pt.lng);
            const isSelected = selectedHotspot?.id === pt.id;

            const ringColors = {
              Critical: "border-semantic-danger bg-semantic-danger/30 text-semantic-danger",
              High: "border-risk-high bg-risk-high/30 text-risk-high",
              Medium: "border-semantic-warning bg-semantic-warning/30 text-semantic-warning",
              Low: "border-semantic-success bg-semantic-success/30 text-semantic-success",
            };

            return (
              <div
                key={pt.id}
                onClick={() => onSelectHotspot(pt)}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                {/* Pulse Ring */}
                <div
                  className={`relative flex items-center justify-center p-2 rounded-full border-2 transition-all duration-200 ${
                    ringColors[pt.risk]
                  } ${isSelected ? "scale-125 ring-4 ring-primary shadow-2xl" : "hover:scale-110"}`}
                >
                  {pt.risk === "Critical" && (
                    <span className="absolute inset-0 rounded-full bg-semantic-danger opacity-75 animate-ping" />
                  )}
                  <ShieldAlert className="w-4 h-4 shrink-0 relative z-10" />
                </div>

                {/* Hotspot Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-slate-900/90 border border-border text-[10px] font-mono text-white whitespace-nowrap shadow-md pointer-events-none group-hover:scale-105 transition-transform">
                  {pt.district} ({pt.cases})
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 p-3 bg-slate-900/95 border border-border rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md pointer-events-none min-w-[240px]">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="font-bold text-white">{hoveredPoint.name}</span>
              <span className="font-mono text-primary">{hoveredPoint.risk} Risk</span>
            </div>
            <div className="text-gray-300 text-[11px]">{hoveredPoint.district} • {hoveredPoint.policeStation}</div>
            <div className="flex justify-between font-mono text-[11px] pt-1">
              <span>Total FIRs: {hoveredPoint.cases}</span>
              <span className="text-semantic-danger">{hoveredPoint.trend} Surge</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Camera Controls (Top Right Overlay) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1.5 bg-card/90 border border-border rounded-xl shadow-xl backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPitch((p) => (p === 0 ? 45 : 0))}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Toggle 3D Pitch View"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
