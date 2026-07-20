"use client";

import React, { useState, useRef } from "react";
import { RiskLevel } from "@/components/ui/risk-badge";
import {
  FileText,
  UserX,
  UserCheck,
  Shield,
  MapPin,
  Home,
  Landmark,
  Layers,
  Car,
  Phone,
  CreditCard,
  Crosshair,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from "lucide-react";

export type EntityType =
  | "Case"
  | "Accused"
  | "Victim"
  | "PoliceStation"
  | "District"
  | "Location"
  | "Court"
  | "CrimeCategory"
  | "Vehicle"
  | "PhoneNumber"
  | "BankAccount"
  | "Weapon"
  | "ModusOperandi";

export interface NetworkNode {
  id: string;
  name: string;
  type: EntityType;
  risk?: RiskLevel;
  riskScore?: number;
  district?: string;
  category?: string;
  x: number;
  y: number;
  details?: string;
  relationshipsCount?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: "Weak" | "Medium" | "Strong" | "Critical";
}

export const mockNodes: NetworkNode[] = [
  { id: "node-fir-491", name: "FIR-2026-00491", type: "Case", risk: "Critical", riskScore: 89, district: "Bengaluru Urban", category: "Cyber Crime", x: 450, y: 280, details: "₹4.2L Phishing Scam at HSR Layout", relationshipsCount: 6 },
  { id: "node-acc-901", name: "Rajesh Kumar (A-901)", type: "Accused", risk: "Critical", riskScore: 92, district: "Bengaluru Urban", category: "Cyber Crime", x: 280, y: 180, details: "Prime suspect linked to 4 cyber fraud FIRs", relationshipsCount: 8 },
  { id: "node-acc-402", name: "Suresh 'Spider' V.", type: "Accused", risk: "High", riskScore: 78, district: "Bengaluru Urban", category: "Property Theft", x: 620, y: 160, details: "Repeat offender in Indiranagar burglaries", relationshipsCount: 5 },
  { id: "node-vic-102", name: "Anand Sharma", type: "Victim", risk: "Low", riskScore: 20, district: "Bengaluru Urban", category: "Cyber Crime", x: 380, y: 440, details: "Victim of online phishing fraud", relationshipsCount: 2 },
  { id: "node-ps-hsr", name: "HSR Layout PS", type: "PoliceStation", risk: "Medium", riskScore: 50, district: "Bengaluru Urban", category: "Jurisdiction", x: 150, y: 320, details: "Primary sector police station", relationshipsCount: 12 },
  { id: "node-phone-01", name: "+91 98450 11029", type: "PhoneNumber", risk: "High", riskScore: 84, district: "Bengaluru Urban", category: "Telecom", x: 480, y: 110, details: "Mule account OTP recipient number", relationshipsCount: 4 },
  { id: "node-bank-01", name: "A/C 948102841", type: "BankAccount", risk: "Critical", riskScore: 88, district: "Bengaluru Urban", category: "Financial", x: 260, y: 420, details: "Frozen fraudulent bank account", relationshipsCount: 3 },
  { id: "node-veh-01", name: "KA-01-MJ-8910", type: "Vehicle", risk: "High", riskScore: 76, district: "Bengaluru Urban", category: "Transport", x: 680, y: 340, details: "Black Pulsar getaway motorcycle", relationshipsCount: 3 },
  { id: "node-mo-01", name: "Forced Lock Bypassing", type: "ModusOperandi", risk: "Medium", riskScore: 65, district: "Bengaluru Urban", category: "MO Profile", x: 600, y: 460, details: "Crowbar door jam technique", relationshipsCount: 4 },
  { id: "node-loc-hsr", name: "HSR Sector 2 Locality", type: "Location", risk: "Medium", riskScore: 55, district: "Bengaluru Urban", category: "Geo Point", x: 320, y: 540, details: "Hotspot incident location", relationshipsCount: 5 },
];

export const mockEdges: NetworkEdge[] = [
  { id: "edge-1", source: "node-acc-901", target: "node-fir-491", label: "Prime Accused In", strength: "Critical" },
  { id: "edge-2", source: "node-fir-491", target: "node-ps-hsr", label: "Filed At", strength: "Strong" },
  { id: "edge-3", source: "node-vic-102", target: "node-fir-491", label: "Complainant In", strength: "Medium" },
  { id: "edge-4", source: "node-acc-901", target: "node-phone-01", label: "Registered Phone", strength: "Critical" },
  { id: "edge-5", source: "node-acc-901", target: "node-bank-01", label: "Transferred Funds", strength: "Critical" },
  { id: "edge-6", source: "node-acc-402", target: "node-fir-491", label: "Associate Link", strength: "Strong" },
  { id: "edge-7", source: "node-acc-402", target: "node-veh-01", label: "Used Vehicle", strength: "Strong" },
  { id: "edge-8", source: "node-acc-402", target: "node-mo-01", label: "Common MO", strength: "Medium" },
  { id: "edge-9", source: "node-fir-491", target: "node-loc-hsr", label: "Occurred At", strength: "Medium" },
];

export const entityConfig: Record<
  EntityType,
  { label: string; icon: React.ElementType; color: string; border: string; bg: string }
> = {
  Case: { label: "Case FIR", icon: FileText, color: "#2563EB", border: "border-primary", bg: "bg-primary/20" },
  Accused: { label: "Accused Person", icon: UserX, color: "#EF4444", border: "border-semantic-danger", bg: "bg-semantic-danger/20" },
  Victim: { label: "Victim Person", icon: UserCheck, color: "#22C55E", border: "border-semantic-success", bg: "bg-semantic-success/20" },
  PoliceStation: { label: "Police Station", icon: Shield, color: "#06B6D4", border: "border-accent", bg: "bg-accent/20" },
  District: { label: "District", icon: MapPin, color: "#3B82F6", border: "border-semantic-info", bg: "bg-semantic-info/20" },
  Location: { label: "Location", icon: Home, color: "#F59E0B", border: "border-semantic-warning", bg: "bg-semantic-warning/20" },
  Court: { label: "Judicial Court", icon: Landmark, color: "#8B5CF6", border: "border-purple-500", bg: "bg-purple-500/20" },
  CrimeCategory: { label: "Crime Category", icon: Layers, color: "#F97316", border: "border-orange-500", bg: "bg-orange-500/20" },
  Vehicle: { label: "Vehicle", icon: Car, color: "#6366F1", border: "border-indigo-500", bg: "bg-indigo-500/20" },
  PhoneNumber: { label: "Phone Number", icon: Phone, color: "#14B8A6", border: "border-teal-500", bg: "bg-teal-500/20" },
  BankAccount: { label: "Bank Account", icon: CreditCard, color: "#D97706", border: "border-amber-600", bg: "bg-amber-600/20" },
  Weapon: { label: "Weapon", icon: Crosshair, color: "#F43F5E", border: "border-rose-500", bg: "bg-rose-500/20" },
  ModusOperandi: { label: "Modus Operandi", icon: Sparkles, color: "#10B981", border: "border-emerald-500", bg: "bg-emerald-500/20" },
};

export interface NetworkGraphCanvasProps {
  selectedNode: NetworkNode | null;
  onSelectNode: (node: NetworkNode) => void;
  nodes?: NetworkNode[];
  edges?: NetworkEdge[];
  showLabels?: boolean;
}

export const NetworkGraphCanvas: React.FC<NetworkGraphCanvasProps> = ({
  selectedNode,
  onSelectNode,
  nodes = mockNodes,
  edges = mockEdges,
  showLabels = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.5));
  const handleReset = () => setZoom(1);

  // Check if a node is connected to the selected node
  const isConnected = (nodeId: string) => {
    if (!selectedNode) return true;
    if (selectedNode.id === nodeId) return true;
    return edges.some(
      (e) =>
        (e.source === selectedNode.id && e.target === nodeId) ||
        (e.target === selectedNode.id && e.source === nodeId)
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[620px] bg-[#070D18] rounded-xl border border-card-border overflow-hidden select-none shadow-2xl flex flex-col justify-between"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Header Status */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg shadow-lg pointer-events-auto">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Cytoscape.js Relationship Engine Viewport
          </span>
          <span className="text-[10px] font-mono text-primary bg-primary/15 px-2 py-0.5 rounded border border-primary/30">
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>
      </div>

      {/* Interactive Cytoscape Canvas Container */}
      <div className="relative w-full h-full flex-1 flex items-center justify-center p-6">
        <div
          className="relative w-full h-full max-w-5xl transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {/* Edge Lines Layer */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10">
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedNode &&
                (selectedNode.id === edge.source || selectedNode.id === edge.target);

              const opacity = selectedNode ? (isHighlighted ? 0.9 : 0.15) : 0.6;

              const strokeWidths = { Weak: 1.5, Medium: 2.5, Strong: 3.5, Critical: 5 };
              const strokeWidth = strokeWidths[edge.strength] || 2;

              const strokeColors = {
                Critical: "#EF4444",
                Strong: "#2563EB",
                Medium: "#F59E0B",
                Weak: "#9CA3AF",
              };

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={strokeColors[edge.strength]}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    strokeDasharray={edge.strength === "Weak" ? "4 4" : "none"}
                  />
                  {showLabels && (
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 6}
                      fill="#9CA3AF"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      opacity={opacity}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          {nodes.map((node) => {
            const config = entityConfig[node.type] || entityConfig.Case;
            const Icon = config.icon;
            const isSelected = selectedNode?.id === node.id;
            const activeConnected = isConnected(node.id);
            const opacity = activeConnected ? 1 : 0.25;

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ left: node.x, top: node.y, opacity }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-200 ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110"
                }`}
              >
                {/* Node Box */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 shadow-2xl backdrop-blur-md transition-shadow ${
                    config.bg
                  } ${config.border} ${
                    isSelected ? "ring-4 ring-primary shadow-[0_0_20px_rgba(37,99,235,0.6)]" : ""
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                  {showLabels && (
                    <span className="text-xs font-semibold text-white tracking-wide font-mono">
                      {node.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredNode && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 p-3 bg-slate-900/95 border border-border rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md pointer-events-none min-w-[240px]">
            <div className="flex items-center justify-between border-b border-border/60 pb-1">
              <span className="font-bold text-white">{hoveredNode.name}</span>
              <span className="font-mono text-accent">{hoveredNode.type}</span>
            </div>
            {hoveredNode.details && <div className="text-gray-300 text-[11px]">{hoveredNode.details}</div>}
            <div className="flex justify-between font-mono text-[11px] pt-1">
              <span>District: {hoveredNode.district || "Statewide"}</span>
              <span className="text-primary">{hoveredNode.relationshipsCount || 4} Connections</span>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar Controls (Top Right Overlay) */}
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
          onClick={handleReset}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Fit Graph Screen"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (containerRef.current) {
              if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }
          }}
          className="p-2 text-gray-300 hover:text-white hover:bg-surface rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
