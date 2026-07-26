"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
// @ts-ignore
import fcose from "cytoscape-fcose";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";

try { cytoscape.use(fcose); } catch { /* registered during HMR */ }

export interface SelectedGraphNode {
  id: string;
  label: string;
  type: string;
  connections: Array<{ id: string; label: string; type: string; relationship: string }>;
}

interface Props {
  onNodeSelect: (node: SelectedGraphNode | null) => void;
  graphMode: string;
  showLowPriority: boolean;
  exportTrigger: "png" | "json" | null;
  onExportComplete: () => void;
}

export const NetworkGraphCanvas: React.FC<Props> = ({ onNodeSelect, graphMode, showLowPriority, exportTrigger, onExportComplete }) => {
  const { activeInvestigation, activeFir } = useInvestigation();
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [mounted, setMounted] = useState(false);

  const runLayout = useCallback(() => {
    const cy = cyRef.current;
    if (!cy || cy.elements().empty()) return;
    cy.resize();
    const layout = cy.layout({
      name: "fcose", animate: true, animationDuration: 550, fit: false, padding: 100,
      nodeRepulsion: 260000, idealEdgeLength: 260, gravity: 0.16, numIter: 2200, nodeSeparation: 160,
    } as cytoscape.LayoutOptions);
    layout.one("layoutstop", () => { cy.resize(); cy.fit(undefined, 80); });
    layout.run();
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.edges(".low-priority").toggleClass("is-hidden", !showLowPriority);
  }, [showLowPriority]);

  useEffect(() => {
    if (!exportTrigger || !cyRef.current) return;
    const cy = cyRef.current;
    if (exportTrigger === "png") {
      const link = document.createElement("a");
      link.href = cy.png({ bg: "#0a0c14", full: true });
      link.download = `investigation_network_${activeInvestigation?.entityId || "export"}.png`;
      link.click();
    } else {
      const blob = new Blob([JSON.stringify(cy.json(), null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = "investigation_network.json"; link.click();
      URL.revokeObjectURL(link.href);
    }
    onExportComplete();
  }, [exportTrigger, activeInvestigation, onExportComplete]);

  const elements = useMemo(() => {
    if (!activeFir) return [];
    const fir = activeFir;
    const nodes: any[] = [{ data: { id: fir.id, label: fir.firNumber, type: "FIR" } }];
    const edges: any[] = [];
    const add = (id: string, label: string, type: string) => nodes.push({ data: { id, label, type } });
    const relate = (source: string, target: string, label: string, priority: "primary" | "low" = "primary") =>
      edges.push({ data: { id: `${source}-${target}-${label}`, source, target, label, priority }, classes: priority === "low" ? "low-priority" : "" });

    const victims = (MOCK_DB.victims || []).filter(item => item.firId === fir.firNumber);
    victims.forEach(item => { add(item.id, item.name, "Victim"); relate(fir.id, item.id, "Complainant"); });
    if (!victims.length) { add("vic-default", "Somashekar Rao", "Victim"); relate(fir.id, "vic-default", "Complainant"); }

    const suspects = MOCK_DB.suspects.filter(item => fir.linkedSuspects.includes(item.id));
    suspects.forEach(item => { add(item.id, item.name, "Suspect"); relate(fir.id, item.id, "Primary accused"); });
    if (suspects.length > 1) relate(suspects[0].id, suspects[1].id, "Co-conspirator");

    const phones = (MOCK_DB.phoneRecords || []).filter(item => item.firId === fir.firNumber);
    phones.forEach((item, index) => {
      add(item.id, item.phoneNumber, "Phone");
      // Some CDR records point to a suspect in the broader database rather than
      // this FIR's suspect list. Keep the edge inside the rendered graph.
      const linkedSuspect = suspects.find(suspect => suspect.id === item.linkedSuspectId);
      relate(linkedSuspect?.id || suspects[0]?.id || fir.id, item.id, "Registered line");
      // Telecom mode intentionally limits the view to handsets and their serving towers.
      const towerId = `tower-${fir.id}-${index + 1}`;
      add(towerId, `Cell Tower ${index + 1}`, "Tower");
      relate(item.id, towerId, "Tower ping", "low");
    });

    const accounts = (MOCK_DB.bankAccounts || []).filter(item => item.firId === fir.firNumber);
    accounts.forEach((item, index) => {
      add(item.id, `${item.bankName} • ${item.accountNumber.slice(-4)}`, "BankAccount");
      relate(victims[index % Math.max(victims.length, 1)]?.id || "vic-default", item.id, "Funds transferred");
      if (suspects[index % Math.max(suspects.length, 1)]) relate(item.id, suspects[index % suspects.length].id, "Funds received");
    });

    const stationId = `station-${fir.id}`;
    add(stationId, fir.station, "PoliceStation");
    relate(fir.id, stationId, "Investigated by", "low");
    (MOCK_DB.vehicles || []).filter(item => item.firId === fir.firNumber).forEach(item => {
      add(item.id, item.plateNumber, "Vehicle");
      const owner = suspects.find(suspect => suspect.name === item.ownerName);
      relate(owner?.id || fir.id, item.id, owner ? "Registered owner" : "ANPR sighting");
    });
    MOCK_DB.firs.filter(item => item.category === fir.category && item.id !== fir.id).slice(0, 3).forEach(item => {
      add(item.id, item.firNumber, "FIR"); relate(fir.id, item.id, "Modus operandi match", "low");
    });

    if (graphMode === "Financial Flow") {
      const keep = new Set(["Victim", "BankAccount", "Suspect"]);
      const visible = nodes.filter(node => keep.has(node.data.type));
      const ids = new Set(visible.map(node => node.data.id));
      return [...visible, ...edges.filter(edge => ids.has(edge.data.source) && ids.has(edge.data.target) && /Funds/.test(edge.data.label))];
    }
    if (graphMode === "Telecom Intelligence") {
      const visible = nodes.filter(node => ["Phone", "Tower"].includes(node.data.type));
      const ids = new Set(visible.map(node => node.data.id));
      return [...visible, ...edges.filter(edge => ids.has(edge.data.source) && ids.has(edge.data.target) && edge.data.label === "Tower ping")];
    }
    return [...nodes, ...edges];
  }, [activeFir, graphMode]);

  useEffect(() => { const frame = requestAnimationFrame(runLayout); return () => cancelAnimationFrame(frame); }, [elements, runLayout]);

  const stylesheet: any[] = [
    { selector: "node", style: { label: "data(label)", color: "#e2e8f0", "font-size": "11px", "font-weight": "bold", "text-valign": "bottom", "text-margin-y": 8, "border-width": 2, width: 38, height: 38, shape: "ellipse", "transition-property": "opacity, border-width, background-color", "transition-duration": "220ms" } },
    { selector: "node[type = 'FIR']", style: { "background-color": "#2563eb", "border-color": "#60a5fa", width: 46, height: 46 } },
    { selector: "node[type = 'Suspect']", style: { "background-color": "#ef4444", "border-color": "#fca5a5" } },
    { selector: "node[type = 'Victim']", style: { "background-color": "#ec4899", "border-color": "#f9a8d4" } },
    { selector: "node[type = 'Phone']", style: { "background-color": "#f97316", "border-color": "#fdba74" } },
    { selector: "node[type = 'BankAccount']", style: { "background-color": "#8b5cf6", "border-color": "#c4b5fd" } },
    { selector: "node[type = 'PoliceStation'], node[type = 'Tower']", style: { "background-color": "#64748b", "border-color": "#cbd5e1" } },
    { selector: "node[type = 'Vehicle']", style: { "background-color": "#22c55e", "border-color": "#86efac" } },
    { selector: "edge", style: { width: 2, "line-color": "#475569", "target-arrow-color": "#475569", "target-arrow-shape": "triangle", "curve-style": "bezier", label: "", "text-opacity": 0, "font-size": "10px", color: "#e2e8f0", "text-background-color": "#0f172a", "text-background-opacity": 0.9, "text-background-padding": "3px", "transition-property": "opacity, line-color, width", "transition-duration": "220ms" } },
    { selector: "edge:hover", style: { label: "data(label)", "text-opacity": 1, width: 3, "line-color": "#94a3b8", "target-arrow-color": "#94a3b8" } },
    { selector: ".is-hidden", style: { display: "none" } },
    { selector: ".is-dim", style: { opacity: 0.13 } },
    { selector: ".is-focus", style: { opacity: 1, "border-width": 4, "border-color": "#ffffff", width: 46, height: 46 } },
    { selector: "edge.is-focus", style: { opacity: 1, width: 3, "line-color": "#fbbf24", "target-arrow-color": "#fbbf24" } },
  ];

  if (!mounted) return null;
  return <div className="absolute inset-0"><CytoscapeComponent elements={elements} style={{ width: "100%", height: "100%" }} stylesheet={stylesheet} cy={cy => {
    cyRef.current = cy; requestAnimationFrame(runLayout);
    cy.removeAllListeners();
    cy.on("tap", "node", event => {
      const node = event.target;
      const neighborhood = node.closedNeighborhood();
      cy.elements().removeClass("is-focus is-dim");
      cy.elements().not(neighborhood).addClass("is-dim"); neighborhood.addClass("is-focus");
      const connections = node.connectedEdges().map((edge: cytoscape.EdgeSingular) => {
        const other = edge.source().id() === node.id() ? edge.target() : edge.source();
        return { id: other.id(), label: other.data("label"), type: other.data("type"), relationship: edge.data("label") };
      });
      onNodeSelect({ id: node.id(), label: node.data("label"), type: node.data("type"), connections });
    });
    cy.on("tap", event => { if (event.target === cy) { cy.elements().removeClass("is-focus is-dim"); onNodeSelect(null); } });
  }} /></div>;
};
