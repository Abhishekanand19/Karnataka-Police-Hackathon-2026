"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Activity, ChevronRight, Target } from "lucide-react";
import { useInvestigation } from "@/providers/investigation-provider";
import { buildInvestigationMarkers } from "@/lib/investigation-markers";
import { OperationsIntelligencePanel } from "@/components/operations-map/operations-intelligence-panel";

const InvestigationMap = dynamic(
  () => import("@/components/map/investigation-map").then(m => m.InvestigationMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#030407]">
        <span className="rounded-lg bg-surface/90 px-4 py-2 text-sm font-medium text-gray-300">Loading spatial intelligence…</span>
      </div>
    ),
  }
);

export default function OperationsMapPage() {
  const { activeFir } = useInvestigation();
  const { markers, patrolRadiusKm } = useMemo(() => buildInvestigationMarkers(activeFir), [activeFir]);
  const relatedCount = markers.filter(m => m.kind === "related").length;
  const suspectCount = markers.filter(m => m.kind === "suspect").length;

  if (!activeFir) return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#030407] text-white">
      <Target className="mb-4 h-16 w-16 text-gray-700" />
      <h2 className="mb-2 text-xl font-bold">No Active Investigation</h2>
      <p className="mb-6 max-w-md text-center text-gray-400">Select an FIR from the workspace to view its investigation area.</p>
      <Link href="/workspace" className="rounded-lg bg-primary px-6 py-2 font-bold">Go to Workspace</Link>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#030407]">
      <header className="flex shrink-0 items-center justify-between border-b border-border/70 bg-surface px-6 py-3">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="font-semibold text-gray-400 hover:text-white">Dashboard</Link>
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <span className="font-semibold text-gray-300">Operations Map</span>
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <span className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 font-bold text-primary"><Activity className="h-4 w-4" />{activeFir.firNumber}</span>
        </div>
        <div className="text-sm text-gray-300">{activeFir.station} · {activeFir.district}</div>
      </header>
      <main className="relative min-h-[620px] flex-1">
        <InvestigationMap key={activeFir.firNumber} markers={markers} activeFirNumber={activeFir.firNumber} patrolRadiusKm={patrolRadiusKm} />
        <aside className="absolute right-5 top-5 bottom-5 z-20 w-[340px] max-w-[calc(100%-2.5rem)]">
          <OperationsIntelligencePanel activeFir={activeFir} nearbyCases={relatedCount} activeSuspects={suspectCount} patrolRadiusKm={patrolRadiusKm} />
        </aside>
      </main>
    </div>
  );
}
