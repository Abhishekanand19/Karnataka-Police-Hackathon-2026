"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AlertTriangle, ExternalLink, MapPin, X } from "lucide-react";

export type InvestigationMarkerKind = "fir" | "related" | "suspect" | "victim" | "station" | "scene" | "vehicle" | "cctv" | "phone";

export interface InvestigationMarker {
  id: string;
  name: string;
  relation: string;
  timestamp: string;
  lng: number;
  lat: number;
  kind: InvestigationMarkerKind;
}

interface InvestigationMapProps {
  markers: InvestigationMarker[];
  activeFirNumber: string;
  patrolRadiusKm: number;
}

const colors: Record<InvestigationMarkerKind, string> = {
  fir: "#ef4444", related: "#a855f7", suspect: "#f97316", victim: "#ec4899",
  station: "#3b82f6", scene: "#f59e0b", vehicle: "#06b6d4", cctv: "#22c55e", phone: "#eab308",
};

const distanceKm = (a: InvestigationMarker, b: InvestigationMarker) => {
  const rad = (value: number) => value * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const InvestigationMap: React.FC<InvestigationMapProps> = ({ markers, activeFirNumber, patrolRadiusKm }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<InvestigationMarker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const firMarker = useMemo(() => markers.find(marker => marker.kind === "fir") || markers[0], [markers]);

  useLayoutEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!token) { setError("NEXT_PUBLIC_MAPBOX_TOKEN is missing."); setIsLoading(false); return; }
    let cancelled = false;
    let frame = 0;
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    const initialize = () => {
      const container = containerRef.current;
      if (cancelled || !container) return;
      // Mapbox reads dimensions at construction. A zero-sized flex/absolute
      // container produces a black canvas that cannot recover on its own.
      if (container.clientWidth < 32 || container.clientHeight < 32) { frame = requestAnimationFrame(initialize); return; }
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [firMarker.lng, firMarker.lat],
        zoom: 13,
        attributionControl: false,
        antialias: true,
      });
      map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
      map.once("load", () => {
        if (cancelled) return;
        clearTimeout(loadTimer);
        requestAnimationFrame(() => { map.resize(); setLoaded(true); setIsLoading(false); });
      });
      map.on("error", event => {
        // Tile retries can emit transient errors. Surface only a style/bootstrap
        // failure; otherwise Mapbox can recover and render normally.
        if (!cancelled && event.error && !map.isStyleLoaded()) {
          clearTimeout(loadTimer);
          setError(event.error.message || "Mapbox failed to load its style.");
          setIsLoading(false);
        }
      });
      loadTimer = setTimeout(() => { if (!cancelled && !map.loaded()) { setError("Map style did not load within 12 seconds. Check the Mapbox token and network access."); setIsLoading(false); } }, 12000);
      mapRef.current = map;
    };
    frame = requestAnimationFrame(initialize);
    const observer = new ResizeObserver(() => {
      const map = mapRef.current;
      if (map) requestAnimationFrame(() => map.resize());
    });
    observer.observe(containerRef.current);
    return () => { cancelled = true; cancelAnimationFrame(frame); clearTimeout(loadTimer); observer.disconnect(); mapRef.current?.remove(); mapRef.current = null; };
  }, [token, firMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || !firMarker) return;
    markerRefs.current.forEach(marker => marker.remove()); markerRefs.current = [];
    markers.forEach(marker => {
      const element = document.createElement("button");
      element.className = "relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/90 shadow-[0_4px_18px_rgba(0,0,0,.65)] transition-transform hover:scale-110";
      element.style.backgroundColor = colors[marker.kind];
      element.innerHTML = `<span class="h-2.5 w-2.5 rounded-full bg-white"></span>`;
      element.title = `${marker.name}: ${marker.relation}`;
      element.onclick = event => { event.stopPropagation(); setSelected(marker); map.flyTo({ center: [marker.lng, marker.lat], zoom: Math.max(map.getZoom(), 14), duration: 650 }); };
      markerRefs.current.push(new mapboxgl.Marker({ element, anchor: "center" }).setLngLat([marker.lng, marker.lat]).addTo(map));
    });
    const bounds = new mapboxgl.LngLatBounds(); markers.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    if (markers.length > 1) map.fitBounds(bounds, { padding: { top: 100, right: 390, bottom: 90, left: 80 }, maxZoom: 14, duration: 800 });
    const points = 48; const ring = Array.from({ length: points + 1 }, (_, i) => {
      const bearing = i / points * 2 * Math.PI; const latOffset = patrolRadiusKm / 111 * Math.cos(bearing); const lngOffset = patrolRadiusKm / (111 * Math.cos(firMarker.lat * Math.PI / 180)) * Math.sin(bearing); return [firMarker.lng + lngOffset, firMarker.lat + latOffset];
    });
    const data = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } } as any;
    if (map.getSource("investigation-radius")) (map.getSource("investigation-radius") as mapboxgl.GeoJSONSource).setData(data);
    else { map.addSource("investigation-radius", { type: "geojson", data }); map.addLayer({ id: "investigation-radius-fill", type: "fill", source: "investigation-radius", paint: { "fill-color": "#3b82f6", "fill-opacity": .10 } }); map.addLayer({ id: "investigation-radius-line", type: "line", source: "investigation-radius", paint: { "line-color": "#60a5fa", "line-width": 2, "line-dasharray": [2, 2] } }); }
  }, [loaded, markers, firMarker, patrolRadiusKm]);

  const selectedDistance = selected && firMarker ? distanceKm(firMarker, selected).toFixed(1) : null;
  return <div className="relative h-full min-h-[620px] w-full overflow-hidden bg-[#080b12]">
    <div ref={containerRef} className="absolute inset-0 min-h-[620px]" />
    <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-xl bg-[#0f172a]/95 px-4 py-3 shadow-xl"><div className="flex items-center gap-2 text-sm font-semibold text-white"><MapPin className="h-4 w-4 text-primary" /> Investigation area</div><p className="mt-1 text-xs text-gray-300">{activeFirNumber} · {markers.length} linked locations</p></div>
    {selected && <div className="absolute bottom-5 left-5 z-20 w-[310px] rounded-2xl bg-[#101827]/95 p-5 shadow-2xl backdrop-blur"><button onClick={() => setSelected(null)} className="absolute right-3 top-3 text-gray-400 hover:text-white"><X className="h-4 w-4" /></button><div className="text-xs font-semibold uppercase tracking-wide text-primary">{selected.relation}</div><h3 className="mt-1 pr-5 text-base font-semibold text-white">{selected.name}</h3><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-gray-400">Timestamp</dt><dd className="text-right text-gray-200">{selected.timestamp}</dd></div><div className="flex justify-between gap-3"><dt className="text-gray-400">Distance from FIR</dt><dd className="text-gray-200">{selectedDistance} km</dd></div></dl><button onClick={() => window.location.assign("/network")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white"><ExternalLink className="h-4 w-4" /> Open Entity</button></div>}
    {error && <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080b12] text-center"><AlertTriangle className="mb-3 h-8 w-8 text-semantic-danger" /><p className="text-sm text-white">Map unavailable</p><p className="mt-1 text-xs text-gray-400">{error}</p></div>}
    {isLoading && !error && <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#080b12]"><span className="rounded-lg bg-surface/90 px-4 py-2 text-sm font-medium text-gray-200">Loading map...</span></div>}
  </div>;
};
