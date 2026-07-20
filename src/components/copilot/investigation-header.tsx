"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bot, ShieldCheck, Clock, Layers, MapPin } from "lucide-react";

export interface InvestigationHeaderProps {
  district?: string;
  category?: string;
  activeFir?: string;
}

export const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({
  district = "Bengaluru Urban",
  category = "Cyber & Property Crime",
  activeFir = "FIR-2026-00491",
}) => {
  const [seconds, setSeconds] = useState(868);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-3 bg-card/80 border border-card-border rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none">
      {/* Active Scope Breadcrumbs */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
        <div className="flex items-center gap-1 text-primary font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{district}</span>
        </div>
        <span className="text-gray-500">/</span>
        <div className="flex items-center gap-1 text-gray-300">
          <Layers className="w-3.5 h-3.5 text-accent" />
          <span>{category}</span>
        </div>
        <span className="text-gray-500">/</span>
        <Badge variant="accent" size="sm" className="font-mono">
          {activeFir}
        </Badge>
      </div>

      {/* AI Status & Live Session Timer */}
      <div className="flex items-center gap-3 shrink-0">
        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3 h-3 mr-1" /> 0% Hallucination Guard
        </Badge>
        <div className="flex items-center gap-1 font-mono text-gray-300 bg-surface px-2.5 py-1 rounded-lg border border-border">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Session: {formatTimer(seconds)}</span>
        </div>
      </div>
    </div>
  );
};
