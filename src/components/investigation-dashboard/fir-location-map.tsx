"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { FIR } from "@/lib/mock-database";
import { getFirLocation } from "@/lib/investigation-markers";

// A Mapbox Static Image — an <img> that always fills its container via
// object-cover. No WebGL canvas, no resize timing, no flex-height coupling:
// it is physically impossible for this to render as a short strip.
export const FirLocationMap: React.FC<{ fir: FIR }> = ({ fir }) => {
  const { lng, lat } = getFirLocation(fir);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is served from cache it can finish before React attaches
  // onLoad, so verify completeness on mount to guarantee the fade-in fires.
  useEffect(() => {
    setLoaded(false);
    setError(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [token, lng, lat]);

  // Wider zoom shows the surrounding road network; @2x keeps it crisp.
  const url = token
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${lng.toFixed(5)},${lat.toFixed(5)},13.2,0/760x480@2x?logo=false&attribution=false&access_token=${token}`
    : "";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0c14]">
      <style>{`
        @keyframes fir-drop { 0%{transform:translate(-50%,-140%);opacity:0} 60%{transform:translate(-50%,-94%)} 100%{transform:translate(-50%,-100%);opacity:1} }
        @keyframes fir-halo { 0%{transform:translate(-50%,-50%) scale(.5);opacity:.55} 70%{opacity:0} 100%{transform:translate(-50%,-50%) scale(2.6);opacity:0} }
      `}</style>

      {url && !error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={url}
          alt={`Incident location — ${fir.station}, ${fir.district}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Premium depth: subtle vignette + top fade so the scene reads as designed */}
      {loaded && !error && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(5,8,14,0.55) 100%), linear-gradient(180deg, rgba(5,8,14,0.35) 0%, transparent 22%)",
          }}
        />
      )}

      {/* Premium incident pin, anchored at the map centre (which is the FIR). */}
      {loaded && !error && (
        <>
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-7 w-7 rounded-full bg-[#ef4444]" style={{ animation: "fir-halo 2.6s ease-out infinite" }} />
          <svg
            width="36" height="46" viewBox="0 0 36 46"
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,.55))", animation: "fir-drop .5s cubic-bezier(.16,1,.3,1) both" }}
          >
            <path d="M18 45C18 45 33 27 33 16A15 15 0 0 0 3 16C3 27 18 45 18 45Z" fill="#ef4444" stroke="#fff" strokeWidth="2.5" />
            <circle cx="18" cy="16" r="5.5" fill="#fff" />
          </svg>
        </>
      )}

      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-lg bg-surface/90 px-3 py-1.5 text-xs font-medium text-gray-400">Locating incident…</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <AlertTriangle className="mb-2 h-6 w-6 text-semantic-danger" />
          <p className="text-xs text-gray-400">Map unavailable — check the Mapbox token.</p>
        </div>
      )}

      {/* Minimal incident info card */}
      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-[#0b1220]/85 backdrop-blur-md px-3.5 py-2.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-semantic-danger/20 text-semantic-danger shrink-0"><MapPin className="h-3.5 w-3.5" /></span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white leading-tight truncate">{fir.firNumber}</div>
            <div className="text-[11px] text-gray-400 truncate">{fir.station} · {fir.district}</div>
          </div>
          <span className="ml-auto shrink-0 rounded-md bg-primary/15 border border-primary/25 px-2 py-1 text-[10px] font-semibold text-primary truncate max-w-[110px]">{fir.category}</span>
        </div>
      </div>
    </div>
  );
};
