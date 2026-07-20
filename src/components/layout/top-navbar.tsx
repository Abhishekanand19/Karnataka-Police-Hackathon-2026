"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Clock, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Crime Intelligence Command Dashboard", subtitle: "Karnataka State Police Operational Overview" },
  "/map": { title: "Hotspot Intelligence & Spatial Analytics", subtitle: "District-level cluster detection and temporal mapping" },
  "/network": { title: "Criminal Network Investigation Graph", subtitle: "Relationship discovery & multi-entity association engine" },
  "/copilot": { title: "AI Investigator Copilot", subtitle: "Evidence-backed automated intelligence reasoning" },
  "/timeline": { title: "Investigation Timeline Replay", subtitle: "Chronological incident progression & multi-case evolution" },
  "/reports": { title: "Intelligence Report Generator", subtitle: "Audited dossier & executive PDF generation" },
  "/settings": { title: "System & Operational Settings", subtitle: "Role management, API keys & Catalyst integration" },
  "/login": { title: "KSP Officer Portal Authentication", subtitle: "Secure Catalyst authentication gate" },
};

export const TopNavbar: React.FC = () => {
  const pathname = usePathname();
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleString("en-IN", {
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentPage = pageTitles[pathname] || {
    title: "Command Centre",
    subtitle: "Karnataka State Police Intelligence System",
  };

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span>KSP</span>
          <span>/</span>
          <span className="text-primary font-medium">{pathname === "/" ? "dashboard" : pathname.replace("/", "")}</span>
        </div>
        <h2 className="text-sm font-semibold text-white tracking-wide">{currentPage.title}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar Shortcut Placeholder */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-input text-xs text-gray-400 w-64">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="flex-1 truncate">Search FIR, Suspect, District...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-gray-400">
            Ctrl+K
          </kbd>
        </div>

        {/* Live Timestamp */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-card/50 border border-border/60 rounded-lg text-xs font-mono text-gray-300">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>{timeString || "2026-07-20 18:35:00 IST"}</span>
        </div>

        {/* Notification Icon */}
        <button
          className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-card border border-transparent hover:border-border transition-colors"
          title="Security Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-semantic-danger animate-pulse" />
        </button>

        {/* Badge & Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <Badge variant="success" size="sm" className="hidden sm:inline-flex">
            <ShieldCheck className="w-3 h-3 mr-1" /> Authorized
          </Badge>
          <div className="w-8 h-8 rounded-full bg-surface border border-border text-gray-300 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
