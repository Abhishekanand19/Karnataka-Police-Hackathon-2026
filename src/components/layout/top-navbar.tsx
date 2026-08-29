"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Shield, LogOut, ChevronDown, Database } from "lucide-react";
import { useInvestigation } from "@/providers/investigation-provider";
import Link from "next/link";

export interface TopNavbarProps {
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/map": "Operations Map",
  "/network": "Network Graph",
  "/copilot": "AI Copilot",
  "/timeline": "Timeline Replay",
  "/reports": "Intelligence Reports",
  "/admin/database": "Database Explorer",
  "/settings": "Settings",
  "/workspace": "Workspace",
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenCommandPalette, onOpenNotifications }) => {
  const pathname = usePathname();
  const { officer, logout, activeInvestigation } = useInvestigation();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title = ROUTE_TITLES[pathname.replace(/\/$/, "") || "/"] || "CrimeLens AI";

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false); };
    if (profileOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [profileOpen]);

  const getInitials = (name?: string) => {
    if (!name) return "KP";
    const parts = name.split(" ").filter(p => !p.includes("."));
    return (parts.map(p => p[0]).join("").slice(0, 2) || "KP").toUpperCase();
  };

  return (
    <header className="h-14 border-b border-border/80 bg-background/80 backdrop-blur-xl px-5 md:px-6 flex items-center gap-4 sticky top-0 z-40 select-none">
      {/* Page title + active case context */}
      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-[15px] font-semibold text-white tracking-tight">{title}</h1>
        {activeInvestigation && (
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/25 px-2 py-1 text-[11px] font-mono font-semibold text-primary">
            {activeInvestigation.entityId}
          </span>
        )}
      </div>

      {/* Global search — expands to fill available width */}
      <button
        onClick={onOpenCommandPalette}
        className="group flex-1 min-w-0 max-w-2xl mx-auto flex items-center gap-2.5 bg-surface/60 hover:bg-surface border border-border/70 hover:border-border rounded-lg px-3 h-9 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        title="Search cases, suspects, evidence — or run a command (Ctrl+K)"
      >
        <Search className="w-4 h-4 shrink-0 text-gray-500 group-hover:text-primary transition-colors" />
        <span className="truncate text-left flex-1">Search cases, suspects, evidence, vehicles…</span>
        <kbd className="hidden sm:inline-flex items-center bg-card px-1.5 py-0.5 rounded border border-border/70 text-[10px] font-mono text-gray-500">⌘K</kbd>
      </button>

      {/* Right cluster */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/admin/database"
          className="hidden md:inline-flex items-center gap-2 bg-surface/60 hover:bg-surface border border-border/70 hover:border-border h-9 px-3 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
          title="Internal SCRB Database Explorer"
        >
          <Database className="w-4 h-4 text-accent" /> Database Viewer
        </Link>

        <button
          onClick={onOpenNotifications}
          className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-surface border border-transparent hover:border-border/70 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-semantic-danger rounded-full ring-2 ring-background" />
        </button>

        <div className="relative ml-1 pl-2.5 border-l border-border/70" ref={menuRef}>
          <button onClick={() => setProfileOpen(o => !o)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-surface transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold text-[11px] flex items-center justify-center">
              {getInitials(officer?.name)}
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-semibold text-white">{officer?.name || "KSP Officer"}</div>
              <div className="text-[10px] text-gray-500">{officer?.role || "Inspector"} · {officer?.district || "SCRB"}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-surface border border-border rounded-xl shadow-2xl p-1.5 z-50 text-sm">
              <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                <div className="font-semibold text-white text-sm">{officer?.name || "KSP Officer"}</div>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">Badge {officer?.badgeId || "—"} · {officer?.station || "SCRB"}</div>
              </div>
              <Link href="/workspace" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-card text-gray-300 hover:text-white transition-colors text-[13px]">
                <Shield className="w-4 h-4 text-primary" /> Switch case workspace
              </Link>
              <Link href="/settings" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-card text-gray-300 hover:text-white transition-colors text-[13px]">
                <Database className="w-4 h-4 text-accent" /> Preferences & settings
              </Link>
              <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-semantic-danger/15 text-semantic-danger font-medium transition-colors text-[13px] mt-0.5">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
