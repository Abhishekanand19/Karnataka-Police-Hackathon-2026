"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Command,
  Clock,
  User,
  Shield,
  Maximize2,
  Minimize2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TopNavbarProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  commandCenterMode: boolean;
  onToggleCommandCenterMode: () => void;
}

const routeTitles: Record<string, { title: string; category: string }> = {
  "/": { title: "Crime Intelligence Command Centre", category: "Statewide Executive Dashboard" },
  "/map": { title: "Karnataka Spatial Crime Map", category: "Spatial Hotspot & Heatmap Analytics" },
  "/network": { title: "Criminal Network Investigation Graph", category: "Palantir Gotham / i2 Analyst Workspace" },
  "/copilot": { title: "AI Investigator Copilot Workspace", category: "0% Hallucination Decision Support" },
  "/timeline": { title: "Investigation Timeline & Case Replay", category: "12-Step Incident Chronology" },
  "/reports": { title: "Intelligence Dossiers & Reports", category: "Audited Case Reports" },
  "/settings": { title: "System Preferences & Settings", category: "Command Centre Configuration" },
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenCommandPalette,
  onOpenNotifications,
  commandCenterMode,
  onToggleCommandCenterMode,
}) => {
  const pathname = usePathname();
  const routeInfo = routeTitles[pathname] || {
    title: "CrimeLens AI",
    category: "Karnataka State Police SCRB",
  };

  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4 text-primary" />
          <span>KSP SCRB</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-300 font-medium">{routeInfo.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </div>
        <h1 className="text-sm font-bold text-white tracking-tight">{routeInfo.title}</h1>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 bg-surface hover:bg-surface-hover border border-border px-3 py-1.5 rounded-input text-xs text-gray-300 transition-colors"
          title="Search or type command (CTRL+K)"
        >
          <Search className="w-3.5 h-3.5 text-primary" />
          <span>Search or command...</span>
          <kbd className="bg-card px-1.5 py-0.5 rounded border border-border text-[10px] font-mono text-gray-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Command Center Mode Toggle */}
        <button
          onClick={onToggleCommandCenterMode}
          className={`p-2 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            commandCenterMode
              ? "bg-primary/20 border-primary text-primary"
              : "bg-surface border-border text-gray-300 hover:text-white"
          }`}
          title="Toggle Command Center Mode"
        >
          {commandCenterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline text-[11px]">
            {commandCenterMode ? "Standard View" : "Command Mode"}
          </span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-gray-300 hover:text-white transition-colors"
          title="Notification Center Feed"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-semantic-danger rounded-full animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-semantic-danger rounded-full" />
        </button>

        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs font-semibold text-gray-300 bg-surface px-3 py-1.5 rounded-input border border-border">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{timeString || "19:20:00 IST"}</span>
        </div>

        {/* Officer Profile Badge */}
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs flex items-center justify-center">
            VP
          </div>
          <div className="hidden xl:block text-left text-xs leading-tight">
            <div className="font-semibold text-white">Insp. V. Patil</div>
            <div className="text-[10px] text-gray-400">Special Crime Branch</div>
          </div>
        </div>
      </div>
    </header>
  );
};
