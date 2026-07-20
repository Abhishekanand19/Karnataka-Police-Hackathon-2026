"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { MapPin, Layers, Sliders, Play, ShieldAlert } from "lucide-react";

export default function MapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotspot Intelligence & Spatial Analytics"
        description="Geospatial visualization of crime clusters, district risk indicators, and temporal heatmaps across Karnataka."
        badge={<Badge variant="info">Mapbox Integration Ready</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Layers className="w-4 h-4" />}>
              Map Layers
            </Button>
            <Button variant="primary" icon={<Sliders className="w-4 h-4" />}>
              Filter Clusters
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Canvas Placeholder */}
        <div className="lg:col-span-3">
          <Panel title="Interactive Karnataka Geospatial Canvas" className="min-h-[500px]">
            <div className="relative h-[480px] bg-surface/80 rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <MapPin className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h3 className="text-base font-semibold text-white">Mapbox GL Spatial Viewport</h3>
              <p className="text-xs text-gray-400 max-w-md mt-1 mb-6">
                Vector heatmaps, police station overlays, and district boundaries will be connected in Phase 4. Mapbox GL GL JS is configured.
              </p>

              {/* Timeline Slider Placeholder */}
              <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-md p-3 rounded-xl border border-border flex items-center gap-4">
                <Button variant="secondary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
                  Play Timeline
                </Button>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>Jan 2023</span>
                    <span>Current: July 2026</span>
                    <span>Dec 2026</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-primary w-3/4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Panel: Hotspot Intelligence Cards */}
        <div className="space-y-4">
          <Panel title="Active Cluster Feed">
            <div className="space-y-3">
              {[
                { name: "Indiranagar Cyber Hotspot", district: "Bengaluru Urban", cases: 28, level: "Critical" as const },
                { name: "Devaraja Market Theft Cluster", district: "Mysuru", cases: 19, level: "High" as const },
                { name: "Panambur Coast Smuggling Zone", district: "Dakshina Kannada", cases: 14, level: "Medium" as const },
              ].map((c) => (
                <div key={c.name} className="p-3 bg-surface/60 rounded-xl border border-border space-y-2">
                  <div className="flex items-start justify-between">
                    <h5 className="text-xs font-semibold text-white">{c.name}</h5>
                    <RiskBadge level={c.level} />
                  </div>
                  <div className="text-[11px] text-gray-400">{c.district} • {c.cases} Linked Incidents</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Station Coverage">
            <div className="text-xs text-gray-400 space-y-2">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Active Stations Monitored</span>
                <span className="font-mono text-white">120</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Districts Covered</span>
                <span className="font-mono text-white">25</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Geospatial Accuracy</span>
                <span className="font-mono text-semantic-success">High (GPS Coordinates)</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
