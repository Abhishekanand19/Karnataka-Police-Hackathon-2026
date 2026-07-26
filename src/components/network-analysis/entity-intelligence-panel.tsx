"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Map, Network, History } from "lucide-react";
import { MOCK_DB } from "@/lib/mock-database";
import { SelectedGraphNode } from "./network-graph-canvas";

interface Props { selectedNode: SelectedGraphNode | null; }

export const EntityIntelligencePanel: React.FC<Props> = ({ selectedNode }) => {
  const profile = useMemo(() => {
    if (!selectedNode) return null;
    const id = selectedNode.id;
    const fir = MOCK_DB.firs.find(item => item.id === id);
    const suspect = MOCK_DB.suspects.find(item => item.id === id);
    const victim = MOCK_DB.victims.find(item => item.id === id);
    const phone = MOCK_DB.phoneRecords.find(item => item.id === id);
    const bank = MOCK_DB.bankAccounts.find(item => item.id === id);
    const vehicle = MOCK_DB.vehicles.find(item => item.id === id);
    if (fir) return [`${fir.category} • ${fir.status}`, fir.description || "Active investigation record."];
    if (suspect) return [`Risk score ${suspect.riskScore}/100 • ${suspect.status || "Active"}`, "Suspect linked to this investigation."];
    if (victim) return [`${victim.age} years • ${victim.gender}`, `Reported loss: ${victim.lossAmount || "Not recorded"}`];
    if (phone) return [`${phone.carrier} • ${phone.callVolume} calls`, `Subscriber: ${phone.subscriberName}`];
    if (bank) return [`${bank.bankName} • ${bank.status}`, `Balance: ${bank.balance}`];
    if (vehicle) return [`${vehicle.model} • ${vehicle.color}`, `Owner: ${vehicle.ownerName}`];
    return [selectedNode.type === "Tower" ? "Telecom infrastructure" : "Investigation entity", "Supporting record linked to the case."];
  }, [selectedNode]);

  if (!selectedNode || !profile) return <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-surface/50"><Network className="w-11 h-11 text-gray-700 mb-4" /><h3 className="font-bold text-white">Select an entity</h3><p className="mt-2 text-sm text-gray-400">Click a node to see its direct relationships, evidence, and next actions.</p></div>;

  const evidence = selectedNode.connections.slice(0, 3).map(connection => `${connection.relationship}: ${connection.label}`);
  return <div className="flex h-full flex-col bg-surface border-l border-border/80">
    <div className="p-5 border-b border-border/70 bg-card/30"><span className="text-[10px] uppercase tracking-widest font-bold text-primary">{selectedNode.type}</span><h2 className="mt-1 text-xl font-bold text-white">{selectedNode.label}</h2></div>
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <section><h3 className="panel-heading">Profile</h3><p className="text-sm font-medium text-white">{profile[0]}</p><p className="mt-1 text-xs leading-relaxed text-gray-400">{profile[1]}</p></section>
      <section><h3 className="panel-heading">Connected Entities</h3><div className="space-y-2">{selectedNode.connections.length ? selectedNode.connections.map(item => <div key={`${item.id}-${item.relationship}`} className="rounded-lg bg-black/25 px-3 py-2"><p className="text-sm text-white">{item.label}</p><p className="text-[10px] uppercase text-gray-500">{item.relationship} · {item.type}</p></div>) : <p className="text-xs text-gray-500">No direct connections in this view.</p>}</div></section>
      <section><h3 className="panel-heading">Evidence</h3><ul className="space-y-2 text-xs text-gray-300">{evidence.length ? evidence.map(item => <li key={item} className="flex gap-2"><FileText className="w-3.5 h-3.5 text-primary shrink-0" />{item}</li>) : <li className="text-gray-500">No evidence items in this view.</li>}</ul></section>
      <section><h3 className="panel-heading">Timeline</h3><p className="text-xs text-gray-400">Latest relationship activity is available in the case timeline.</p></section>
      <div className="grid grid-cols-2 gap-2"><Link href="/timeline" className="action-link"><History className="w-4 h-4" />Open Timeline<ExternalLink className="w-3 h-3" /></Link><Link href="/map" className="action-link"><Map className="w-4 h-4" />Open Map<ExternalLink className="w-3 h-3" /></Link></div>
    </div>
  </div>;
};
