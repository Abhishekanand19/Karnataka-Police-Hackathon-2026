"use client";

import React, { useEffect, useState } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { Target, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { NetworkGraphCanvas, SelectedGraphNode } from "@/components/network-analysis/network-graph-canvas";
import { NetworkControls } from "@/components/network-analysis/network-controls";
import { EntityIntelligencePanel } from "@/components/network-analysis/entity-intelligence-panel";
import { GraphLegend } from "@/components/network-analysis/graph-legend";

export default function NetworkAnalysisPage() {
  const [selectedNode, setSelectedNode] = useState<SelectedGraphNode | null>(null);
  const [graphMode, setGraphMode] = useState<string>("Investigation Network");
  const [showLowPriority, setShowLowPriority] = useState(false);
  const { activeInvestigation, activeFir } = useInvestigation();

  // Export handlers
  const [exportTrigger, setExportTrigger] = useState<"png" | "json" | null>(null);

  useEffect(() => setSelectedNode(null), [activeInvestigation?.entityId]);

  if (!activeFir) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#030407] text-white">
        <Target className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Active Investigation</h2>
        <p className="text-gray-400 mb-6 max-w-md text-center">
          The Network Graph requires an active FIR context. Please select a case from the dashboard to begin relationship analysis.
        </p>
        <Link href="/dashboard" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-[#030407] overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="flex-none flex items-center justify-between gap-4 px-5 py-3 border-b border-border/80 bg-surface z-20">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors font-semibold">Dashboard</Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-gray-400 font-semibold hidden md:inline">Who is connected?</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg text-primary font-bold">
            <Activity className="w-4 h-4" /> {activeFir.firNumber}
          </div>
        </div>

        <NetworkControls 
          graphMode={graphMode} 
          setGraphMode={setGraphMode} 
          showLowPriority={showLowPriority}
          setShowLowPriority={setShowLowPriority}
          onExport={(type) => setExportTrigger(type)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* Left: Large Graph */}
        <div className="relative flex-1 bg-[#0a0c14] border-r border-border/80 min-w-0">
          <NetworkGraphCanvas 
            onNodeSelect={setSelectedNode}
            graphMode={graphMode}
            showLowPriority={showLowPriority}
            exportTrigger={exportTrigger}
            onExportComplete={() => setExportTrigger(null)}
          />

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-10 bg-surface/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-2xl">
            <GraphLegend />
          </div>
        </div>

        {/* Right: Intelligence Panel */}
        <div className="w-[320px] shrink-0 h-full overflow-hidden bg-surface">
          <EntityIntelligencePanel selectedNode={selectedNode} />
        </div>
      </div>

    </div>
  );
}
