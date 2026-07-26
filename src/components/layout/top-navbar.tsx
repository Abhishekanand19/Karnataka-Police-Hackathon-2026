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

import { useInvestigation } from "@/providers/investigation-provider";
import { LogOut, ChevronDown, Database } from "lucide-react";
import Link from "next/link";

export interface TopNavbarProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
}

const routeTitles: Record<string, { title: string; category: string }> = {
  "/": { title: "Crime Intelligence Command Centre", category: "What is happening?" },
  "/map": { title: "Karnataka Spatial Crime Map", category: "Where is it happening?" },
  "/network": { title: "Criminal Network Investigation Graph", category: "Who is connected?" },
  "/copilot": { title: "AI Investigator Copilot Workspace", category: "Why is it happening?" },
  "/timeline": { title: "Investigation Timeline & Case Replay", category: "How did it happen?" },
  "/reports": { title: "Intelligence Dossiers & Reports", category: "How do we present it?" },
  "/admin/database": { title: "SCRB Master Database Explorer", category: "Internal Data Viewer" },
  "/settings": { title: "System Preferences & Settings", category: "Command Centre Configuration" },
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenCommandPalette,
  onOpenNotifications,
}) => {
  const pathname = usePathname();
  const { officer, logout, activeInvestigation } = useInvestigation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [timeString, setTimeString] = useState<string>("");

  const routeInfo = routeTitles[pathname] || {
    title: "CrimeLens AI",
    category: "Karnataka State Police SCRB",
  };

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

  const getInitials = (name?: string) => {
    if (!name) return "OFF";
    const parts = name.split(" ").filter(p => !p.includes("."));
    return parts.map(p => p[0]).join("").slice(0, 2).toUpperCase() || "KP";
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-5 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4 text-primary" />
          <span>KSP SCRB</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-primary font-semibold">{routeInfo.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </div>
        <h1 className="text-sm font-bold text-white tracking-tight">{routeInfo.title}</h1>

        {activeInvestigation && (
          <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-[11px] text-primary font-mono font-bold">
            <span>ACTIVE: {activeInvestigation.entityId}</span>
          </div>
        )}
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Admin DB Shortcut */}
        <Link
          href="/admin/database"
          className="hidden md:flex items-center gap-1.5 bg-surface hover:bg-surface-hover border border-border px-2.5 py-1.5 rounded-input text-xs text-gray-300 transition-colors"
          title="Internal SCRB Database Explorer"
        >
          <Database className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[11px]">DB Viewer</span>
        </Link>

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
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{timeString || "19:20:00 IST"}</span>
        </div>

        {/* Officer Profile Badge & Dropdown */}
        <div className="relative border-l border-border pl-3">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-xs flex items-center justify-center">
              {getInitials(officer?.name)}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="font-semibold text-white">{officer?.name || "KSP Officer"}</div>
              <div className="text-[10px] text-gray-400">{officer?.role || "Inspector"} • {officer?.district || "SCRB"}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="px-3 py-2 border-b border-border/50">
                <div className="font-bold text-white">{officer?.name}</div>
                <div className="text-[10px] text-gray-400 font-mono">Badge: {officer?.badgeId}</div>
                <div className="text-[10px] text-gray-400">{officer?.station}</div>
              </div>

              <Link
                href="/workspace"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card text-gray-300 hover:text-white transition-colors"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span>Switch Case Workspace</span>
              </Link>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-semantic-danger/20 text-semantic-danger font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
