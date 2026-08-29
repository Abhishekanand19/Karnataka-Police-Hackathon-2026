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
  compact?: boolean;
}

const colors: Record<InvestigationMarkerKind, string> = {
  fir: "#ef4444", related: "#a855f7", suspect: "#f97316", victim: "#ec4899",
  station: "#3b82f6", scene: "#f59e0b", vehicle: "#06b6d4", cctv: "#22c55e", phone: "#eab308",
};

const kindLabel: Record<InvestigationMarkerKind, string> = {
  fir: "Active FIR", related: "Linked FIR", suspect: "Suspect", victim: "Victim",
  station: "Police station", scene: "Crime scene", vehicle: "Vehicle", cctv: "CCTV", phone: "Phone tower",
};

// Presentation order for the legend/filter (most operationally important first).
const kindOrder: InvestigationMarkerKind[] = ["fir", "suspect", "scene", "victim", "vehicle", "phone", "cctv", "station", "related"];

const distanceKm = (a: InvestigationMarker, b: InvestigationMarker) => {
  const rad = (value: number) => value * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const InvestigationMap: React.FC<InvestigationMapProps> = ({ markers, activeFirNumber, patrolRadiusKm, compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRefs = useRef<mapboxgl.Marker[]>([]);
  const markerEls = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<InvestigationMarker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<InvestigationMarkerKind>>(new Set());
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const firMarker = useMemo(() => markers.find(marker => marker.kind === "fir") || markers[0], [markers]);

  // Kinds actually present in this case, with counts — powers the legend/filter.
  const kindCounts = useMemo(() => {
    const map = new Map<InvestigationMarkerKind, number>();
    markers.forEach(m => map.set(m.kind, (map.get(m.kind) || 0) + 1));
    return kindOrder.filter(k => map.has(k)).map(k => ({ kind: k, count: map.get(k)! }));
  }, [markers]);

  // The FIR anchor always stays visible; other kinds can be toggled off.
  const visibleMarkers = useMemo(
    () => markers.filter(m => m.kind === "fir" || !hidden.has(m.kind)),
    [markers, hidden]
  );

  const toggleKind = (k: InvestigationMarkerKind) => {
    if (k === "fir") return;
    setHidden(prev => { const next = new Set(prev); next.has(k) ? next.delete(k) : next.add(k); return next; });
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current || !firMarker) return;
    if (!token) { setError("NEXT_PUBLIC_MAPBOX_TOKEN is missing."); setIsLoading(false); return; }

    // Scoped to this effect run; both the observer and cleanup close over them,
    // so no React state is needed to gate resize safely.
    let cancelled = false;
    let ready = false;         // true only after Mapbox's 'load' fires
    let initFrame = 0;
    let resizeFrame = 0;
    let loadTimer: ReturnType<typeof setTimeout> | undefined;

    const initialize = () => {
      if (cancelled) return;
      const el = containerRef.current;
      if (!el) return;
      // Mapbox reads dimensions at construction; a zero-sized container yields a
      // dead canvas. Wait a frame until layout gives it real size.
      if (el.clientWidth < 32 || el.clientHeight < 32) { initFrame = requestAnimationFrame(initialize); return; }

      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: el,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [firMarker.lng, firMarker.lat],
        zoom: 13,
        attributionControl: false,
        antialias: true,
        scrollZoom: !compact,   // don't hijack page scroll inside a dashboard card
      });
      mapRef.current = map;
      if (!compact) map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

      map.once("load", () => {
        if (cancelled) return;
        clearTimeout(loadTimer);
        ready = true;          // resize is only ever called past this point
        map.resize();
        setLoaded(true);
        setIsLoading(false);
      });
      map.on("error", event => {
        if (!cancelled && event.error && !map.isStyleLoaded()) {
          clearTimeout(loadTimer);
          setError(event.error.message || "Mapbox failed to load its style.");
          setIsLoading(false);
        }
      });
      loadTimer = setTimeout(() => {
        if (!cancelled && !map.loaded()) { setError("Map style did not load within 12 seconds. Check the Mapbox token and network access."); setIsLoading(false); }
      }, 12000);
    };

    initFrame = requestAnimationFrame(initialize);

    // Resize only a fully-loaded, still-mounted map. Coalesce bursts into one
    // frame and cancel any pending frame on teardown — no resize on a removed map.
    const observer = new ResizeObserver(() => {
      if (!ready || !mapRef.current) return;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!cancelled && ready && mapRef.current) mapRef.current.resize();
      });
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      ready = false;
      cancelAnimationFrame(initFrame);
      cancelAnimationFrame(resizeFrame);
      clearTimeout(loadTimer);
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, firMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || !firMarker) return;
    markerRefs.current.forEach(marker => marker.remove()); markerRefs.current = [];
    markerEls.current.clear();
    visibleMarkers.forEach(marker => {
      const isFir = marker.kind === "fir";
      const element = document.createElement("button");
      const size = isFir ? "h-11 w-11" : "h-8 w-8";
      element.className = `relative flex ${size} items-center justify-center rounded-full border-2 border-white/90 shadow-[0_4px_18px_rgba(0,0,0,.65)] transition-transform hover:scale-110`;
      element.style.backgroundColor = colors[marker.kind];
      element.style.zIndex = isFir ? "10" : "1";
      markerEls.current.set(marker.id, element);
      element.innerHTML = isFir
        ? `<span class="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style="background:${colors.fir}"></span><span class="relative h-3 w-3 rounded-full bg-white"></span>`
        : `<span class="h-2.5 w-2.5 rounded-full bg-white"></span>`;
      element.title = `${kindLabel[marker.kind]} · ${marker.name}: ${marker.relation}`;
      element.onclick = event => { event.stopPropagation(); setSelected(marker); map.flyTo({ center: [marker.lng, marker.lat], zoom: Math.max(map.getZoom(), 14), duration: 650 }); };
      markerRefs.current.push(new mapboxgl.Marker({ element, anchor: "center" }).setLngLat([marker.lng, marker.lat]).addTo(map));
    });
    const bounds = new mapboxgl.LngLatBounds(); visibleMarkers.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    if (visibleMarkers.length > 1) map.fitBounds(bounds, { padding: { top: 100, right: 390, bottom: 90, left: 80 }, maxZoom: 14, duration: 800 });
    const points = 48; const ring = Array.from({ length: points + 1 }, (_, i) => {
      const bearing = i / points * 2 * Math.PI; const latOffset = patrolRadiusKm / 111 * Math.cos(bearing); const lngOffset = patrolRadiusKm / (111 * Math.cos(firMarker.lat * Math.PI / 180)) * Math.sin(bearing); return [firMarker.lng + lngOffset, firMarker.lat + latOffset];
    });
    const data = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } } as any;
    if (map.getSource("investigation-radius")) (map.getSource("investigation-radius") as mapboxgl.GeoJSONSource).setData(data);
    else { map.addSource("investigation-radius", { type: "geojson", data }); map.addLayer({ id: "investigation-radius-fill", type: "fill", source: "investigation-radius", paint: { "fill-color": "#3b82f6", "fill-opacity": .10 } }); map.addLayer({ id: "investigation-radius-line", type: "line", source: "investigation-radius", paint: { "line-color": "#60a5fa", "line-width": 2, "line-dasharray": [2, 2] } }); }
  }, [loaded, visibleMarkers, firMarker, patrolRadiusKm]);

  // Selection ring — toggled without re-plotting so the camera never re-fits.
  useEffect(() => {
    markerEls.current.forEach((el, id) => {
      const on = selected?.id === id;
      el.classList.toggle("ring-4", on);
      el.classList.toggle("ring-white/50", on);
      el.style.zIndex = on ? "9" : el.style.zIndex === "10" ? "10" : "1";
    });
  }, [selected, visibleMarkers]);

  const selectedDistance = selected && firMarker ? distanceKm(firMarker, selected).toFixed(1) : null;
  return <div className="relative h-full min-h-[620px] w-full overflow-hidden bg-[#080b12]">
    <div ref={containerRef} className="absolute inset-0 min-h-[620px]" />
    <div className="absolute left-5 top-5 z-10 w-[220px] space-y-2">
      <div className="rounded-xl bg-[#0f172a]/95 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-semibold text-white"><MapPin className="h-4 w-4 text-primary" /> Investigation area</div>
        <p className="mt-1 text-xs text-gray-300 tabular-nums">{activeFirNumber} · {visibleMarkers.length}/{markers.length} locations</p>
      </div>
      {!compact && kindCounts.length > 1 && (
        <div className="rounded-xl bg-[#0f172a]/95 p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Layers</span>
            {hidden.size > 0 && <button onClick={() => setHidden(new Set())} className="text-[10px] font-semibold text-primary hover:underline">Show all</button>}
          </div>
          <div className="space-y-0.5">
            {kindCounts.map(({ kind, count }) => {
              const off = hidden.has(kind);
              return (
                <button
                  key={kind}
                  onClick={() => toggleKind(kind)}
                  disabled={kind === "fir"}
                  className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors ${off ? "opacity-40" : "hover:bg-white/5"} ${kind === "fir" ? "cursor-default" : ""}`}
                  title={kind === "fir" ? "Always shown" : off ? "Show layer" : "Hide layer"}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/30" style={{ backgroundColor: colors[kind] }} />
                  <span className="flex-1 text-xs text-gray-200">{kindLabel[kind]}</span>
                  <span className="text-[10px] tabular-nums text-gray-400">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
    {selected && <div className="absolute bottom-5 left-5 z-20 w-[310px] rounded-2xl bg-[#101827]/95 p-5 shadow-2xl backdrop-blur"><button onClick={() => setSelected(null)} className="absolute right-3 top-3 text-gray-400 hover:text-white"><X className="h-4 w-4" /></button><div className="text-xs font-semibold uppercase tracking-wide text-primary">{selected.relation}</div><h3 className="mt-1 pr-5 text-base font-semibold text-white">{selected.name}</h3><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-gray-400">Timestamp</dt><dd className="text-right text-gray-200">{selected.timestamp}</dd></div><div className="flex justify-between gap-3"><dt className="text-gray-400">Distance from FIR</dt><dd className="text-gray-200">{selectedDistance} km</dd></div></dl><button onClick={() => window.location.assign("/network")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white"><ExternalLink className="h-4 w-4" /> Open Entity</button></div>}
    {error && <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080b12] text-center"><AlertTriangle className="mb-3 h-8 w-8 text-semantic-danger" /><p className="text-sm text-white">Map unavailable</p><p className="mt-1 text-xs text-gray-400">{error}</p></div>}
    {isLoading && !error && <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#080b12]"><span className="rounded-lg bg-surface/90 px-4 py-2 text-sm font-medium text-gray-200">Loading map...</span></div>}
  </div>;
};
