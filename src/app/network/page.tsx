"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  NetworkGraphCanvas,
  mockNodes,
  mockEdges,
  NetworkNode,
} from "@/components/network/network-graph-canvas";
import {
  NetworkSearchPanel,
  mockPresets,
  InvestigationPreset,
} from "@/components/network/network-search-panel";
import { EntityIntelligencePanel } from "@/components/network/entity-intelligence-panel";
import { RelationshipInspectorDrawer } from "@/components/network/relationship-inspector-drawer";
import { NetworkToolbarControls } from "@/components/network/network-toolbar-controls";
import { NetworkLegendControl } from "@/components/network/network-legend-control";
import { GitFork, Sparkles, Plus, RefreshCw, Layers } from "lucide-react";

export default function NetworkPage() {
  const [activePreset, setActivePreset] = useState<InvestigationPreset | null>(mockPresets[0]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(mockNodes[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const handleStartInvestigation = () => {
    setActivePreset(mockPresets[0]);
    setSelectedNode(mockNodes[0]);
  };

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Page Header */}
      <PageHeader
        title="Criminal Network Investigation Graph"
        description="Multi-entity relationship engine linking Case FIRs, Accused Persons, Victims, Modus Operandi, Locations, Vehicles, Shared Phones, and Bank Accounts."
        badge={
          <Badge variant="accent">
            <GitFork className="w-3.5 h-3.5 mr-1" /> Cytoscape.js Engine
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => {
                setActivePreset(mockPresets[0]);
                setSelectedNode(mockNodes[0]);
              }}
            >
              Reset Network View
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleStartInvestigation}
            >
              New Investigation
            </Button>
          </div>
        }
      />

      {/* Top Toolbar Controls */}
      <NetworkToolbarControls
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onReset={() => setSelectedNode(mockNodes[0])}
      />

      {!activePreset ? (
        /* Empty State View */
        <EmptyState
          icon={<GitFork className="w-10 h-10 text-primary stroke-[1.5]" />}
          title="No Active Criminal Network Investigation Selected"
          description="Select an investigation preset from the left panel or click 'Start Investigation' to initialize the Cytoscape.js relationship engine."
          actionLabel="Start Investigation"
          onAction={handleStartInvestigation}
          className="my-8 py-16"
        />
      ) : (
        /* 4-Quadrant Workspace Layout */
        <div className="flex flex-col lg:flex-row gap-4 items-start relative">
          {/* Left Search & Filters Panel */}
          <NetworkSearchPanel
            selectedPresetId={activePreset.id}
            onSelectPreset={(preset) => {
              setActivePreset(preset);
              setSelectedNode(mockNodes[0]);
            }}
          />

          {/* Center Cytoscape Graph Canvas Area */}
          <div className="flex-1 w-full relative">
            <NetworkGraphCanvas
              selectedNode={selectedNode}
              onSelectNode={(node) => setSelectedNode(node)}
              nodes={mockNodes}
              edges={mockEdges}
              showLabels={showLabels}
            />

            {/* Bottom Left Overlay: Legend */}
            <div className="absolute bottom-4 left-4 z-20 hidden md:block">
              <NetworkLegendControl />
            </div>
          </div>

          {/* Right Entity Intelligence Panel */}
          <EntityIntelligencePanel
            selectedNode={selectedNode}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </div>
      )}

      {/* Bottom Relationship Inspector Drawer */}
      <RelationshipInspectorDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        node={selectedNode}
      />
    </div>
  );
}
