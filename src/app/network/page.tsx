"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitFork, ZoomIn, ZoomOut, Maximize2, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Criminal Network Investigation Graph"
        description="Multi-entity relationship engine linking Case FIRs, Accused Persons, Victims, Modus Operandi, Locations, and Vehicles."
        badge={<Badge variant="accent">Cytoscape.js Engine Ready</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<Share2 className="w-4 h-4" />}>
              Export Graph
            </Button>
            <Button variant="primary" icon={<GitFork className="w-4 h-4" />}>
              Expand Associates
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Canvas Placeholder */}
        <div className="lg:col-span-3">
          <Panel title="Interactive Network Graph Canvas" className="min-h-[520px] relative">
            <div className="h-[490px] bg-surface/80 rounded-xl border border-dashed border-border flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <GitFork className="w-16 h-16 text-accent mb-4" />
              <h3 className="text-base font-semibold text-white">Cytoscape.js Relationship Graph</h3>
              <p className="text-xs text-gray-400 max-w-md mt-1 mb-4">
                Node-edge graph calculations for repeat offenders, shared phone numbers, and modus operandi will be initialized in Phase 5.
              </p>

              {/* Controls overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 p-1 bg-card border border-border rounded-lg shadow-lg">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-surface rounded" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-surface rounded" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-surface rounded" title="Fit Screen">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Panel>
        </div>

        {/* Network Side Panel */}
        <div className="space-y-4">
          <Panel title="Entity Inspector">
            <Input icon={<Search className="w-4 h-4" />} placeholder="Search Accused or Case ID..." />
            <div className="mt-4 p-3 bg-surface/50 rounded-xl border border-border space-y-2 text-xs">
              <div className="font-semibold text-white">Selected Node: None</div>
              <p className="text-gray-400 text-[11px]">
                Click on any node in the graph viewport to inspect criminal background, linked FIRs, and associate networks.
              </p>
            </div>
          </Panel>

          <Panel title="Node Legend">
            <div className="space-y-2 text-xs">
              {[
                { label: "Accused Person", color: "bg-semantic-danger" },
                { label: "Case FIR", color: "bg-primary" },
                { label: "Shared Location", color: "bg-accent" },
                { label: "Modus Operandi", color: "bg-semantic-warning" },
                { label: "Police Station", color: "bg-semantic-success" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
