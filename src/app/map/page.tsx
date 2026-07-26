"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Activity, ChevronRight, Target } from "lucide-react";
import { MOCK_DB } from "@/lib/mock-database";
import { useInvestigation } from "@/providers/investigation-provider";
import { InvestigationMap, InvestigationMarker } from "@/components/map/investigation-map";
import { OperationsIntelligencePanel } from "@/components/operations-map/operations-intelligence-panel";

const offset = (index: number) => ({ lat: ((index * 37) % 13 - 6) * 0.0021, lng: ((index * 53) % 15 - 7) * 0.0025 });

export default function OperationsMapPage() {
  const { activeFir } = useInvestigation();
  const markers = useMemo<InvestigationMarker[]>(() => {
    if (!activeFir) return [];
    const hotspot = MOCK_DB.hotspots.find(item => item.policeStation === activeFir.station) || MOCK_DB.hotspots.find(item => item.district === activeFir.district) || MOCK_DB.hotspots[0];
    const point = (id: string, name: string, relation: InvestigationMarker["kind"], label: string, index: number): InvestigationMarker => { const delta = offset(index); return { id, name, relation: label, kind: relation, timestamp: activeFir.date, lng: hotspot.lng + delta.lng, lat: hotspot.lat + delta.lat }; };
    const linkedSuspects = MOCK_DB.suspects.filter(suspect => activeFir.linkedSuspects.includes(suspect.id));
    const result: InvestigationMarker[] = [
      { id: activeFir.id, name: activeFir.firNumber, relation: "Active FIR location", kind: "fir", timestamp: activeFir.date, lng: hotspot.lng, lat: hotspot.lat },
      point(`station-${activeFir.id}`, activeFir.station, "station", "Police station", 1),
      point(`scene-${activeFir.id}`, `${activeFir.district} crime scene`, "scene", "Crime scene", 2),
    ];
    MOCK_DB.victims.filter(item => item.firId === activeFir.firNumber).forEach((item, index) => result.push(point(item.id, item.name, "victim", "Victim address", 3 + index)));
    linkedSuspects.forEach((item, index) => result.push(point(item.id, item.name, "suspect", "Suspect-linked location", 5 + index)));
    MOCK_DB.vehicles.filter(item => item.firId === activeFir.firNumber).forEach((item, index) => result.push(point(item.id, item.plateNumber, "vehicle", "Vehicle sighting", 10 + index)));
    MOCK_DB.phoneRecords.filter(item => item.firId === activeFir.firNumber).forEach((item, index) => result.push(point(item.id, item.phoneNumber, "phone", "Phone tower ping", 14 + index)));
    const cctvEvidence = MOCK_DB.evidence.filter(item => item.firId === activeFir.firNumber && /CCTV/i.test(item.type)).slice(0, 2);
    (cctvEvidence.length ? cctvEvidence : [{ id: `cctv-${activeFir.id}`, title: "CCTV coverage point" }]).forEach((item, index) => result.push(point(item.id, item.title, "cctv", "CCTV evidence location", 18 + index)));
    MOCK_DB.firs.filter(item => item.id !== activeFir.id && item.district === activeFir.district && item.category === activeFir.category).slice(0, 3).forEach((item, index) => result.push(point(item.id, item.firNumber, "related", "Nearby linked FIR", 21 + index)));
    return result;
  }, [activeFir]);
  const patrolRadiusKm = Math.max(1.2, Math.min(4.5, 1.2 + markers.length * 0.16));
  const relatedCount = markers.filter(marker => marker.kind === "related").length;
  const suspectCount = markers.filter(marker => marker.kind === "suspect").length;

  if (!activeFir) return <div className="flex h-full w-full flex-col items-center justify-center bg-[#030407] text-white"><Target className="mb-4 h-16 w-16 text-gray-700" /><h2 className="mb-2 text-xl font-bold">No Active Investigation</h2><p className="mb-6 max-w-md text-center text-gray-400">Select an FIR from the workspace to view its investigation area.</p><Link href="/workspace" className="rounded-lg bg-primary px-6 py-2 font-bold">Go to Workspace</Link></div>;

  return <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#030407]">
    <header className="flex shrink-0 items-center justify-between border-b border-border/70 bg-surface px-6 py-3">
      <div className="flex items-center gap-3 text-sm"><Link href="/dashboard" className="font-semibold text-gray-400 hover:text-white">Dashboard</Link><ChevronRight className="h-4 w-4 text-gray-600" /><span className="font-semibold text-gray-300">Investigation Map</span><ChevronRight className="h-4 w-4 text-gray-600" /><span className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 font-bold text-primary"><Activity className="h-4 w-4" />{activeFir.firNumber}</span></div>
      <div className="text-sm text-gray-300">{activeFir.station} · {activeFir.district}</div>
    </header>
    <main className="relative min-h-[620px] flex-1"><InvestigationMap markers={markers} activeFirNumber={activeFir.firNumber} patrolRadiusKm={patrolRadiusKm} /><aside className="absolute right-5 top-5 bottom-5 z-20 w-[340px]"><OperationsIntelligencePanel activeFir={activeFir} nearbyCases={relatedCount} activeSuspects={suspectCount} patrolRadiusKm={patrolRadiusKm} /></aside></main>
  </div>;
}
