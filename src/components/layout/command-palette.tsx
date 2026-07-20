"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  X,
  FileText,
  MapPin,
  Shield,
  Layers,
  GitFork,
  Bot,
  Clock,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CommandItem {
  id: string;
  category: "Navigation" | "Cases" | "Districts" | "Stations" | "Actions";
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
  badge?: string;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const commands: CommandItem[] = [
    { id: "nav-dash", category: "Navigation", title: "Crime Intelligence Dashboard", subtitle: "Overview KPIs & statewide analytics", icon: Layers, action: () => navigate("/") },
    { id: "nav-map", category: "Navigation", title: "Karnataka Spatial Crime Map", subtitle: "Mapbox heatmap & hotspot density", icon: MapPin, action: () => navigate("/map") },
    { id: "nav-net", category: "Navigation", title: "Criminal Network Investigation Graph", subtitle: "Cytoscape.js relationship engine", icon: GitFork, action: () => navigate("/network") },
    { id: "nav-cop", category: "Navigation", title: "AI Investigator Copilot Workspace", subtitle: "Decision support & evidence reasoning", icon: Bot, action: () => navigate("/copilot") },
    { id: "nav-time", category: "Navigation", title: "Investigation Timeline & Case Replay", subtitle: "Chronological incident story", icon: Clock, action: () => navigate("/timeline") },
    { id: "nav-set", category: "Navigation", title: "System Preferences & Settings", subtitle: "Theme, Command mode & credentials", icon: Settings, action: () => navigate("/settings") },
    { id: "case-491", category: "Cases", title: "FIR-2026-00491", subtitle: "₹4.2L Cyber Phishing Scam • HSR Layout PS", icon: FileText, action: () => navigate("/timeline"), badge: "Critical" },
    { id: "case-488", category: "Cases", title: "FIR-2026-00488", subtitle: "Indiranagar Night Property Burglary", icon: FileText, action: () => navigate("/timeline"), badge: "High" },
    { id: "dist-blr", category: "Districts", title: "Bengaluru Urban District", subtitle: "Risk Score: 89 (Critical) • 1,420 Crimes", icon: MapPin, action: () => navigate("/map"), badge: "Critical" },
    { id: "dist-mys", category: "Districts", title: "Mysuru City District", subtitle: "Risk Score: 62 (Medium) • 640 Crimes", icon: MapPin, action: () => navigate("/map"), badge: "Medium" },
    { id: "ps-hsr", category: "Stations", title: "HSR Layout Police Station", subtitle: "Sector 2 Crime Control Command", icon: Shield, action: () => navigate("/map") },
    { id: "ps-ind", category: "Stations", title: "Indiranagar Police Station", subtitle: "Sector 3 Burglary Squad", icon: Shield, action: () => navigate("/map") },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase())) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[580px] select-none"
      >
        {/* Search Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, districts, police stations, or type commands..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-3 flex-1 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 space-y-1">
              <Sparkles className="w-6 h-6 text-gray-500 mx-auto" />
              <div className="font-semibold text-white">No Matching Command Results</div>
              <div className="text-[11px]">Try searching for &quot;Bengaluru&quot;, &quot;FIR-2026-00491&quot;, or &quot;Network&quot;.</div>
            </div>
          ) : (
            ["Navigation", "Cases", "Districts", "Stations"].map((cat) => {
              const items = filtered.filter((c) => c.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {cat}
                  </div>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        className="px-3 py-2.5 rounded-xl hover:bg-surface/80 border border-transparent hover:border-border cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-surface text-primary border border-border group-hover:border-primary shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-xs group-hover:text-primary flex items-center gap-2">
                              {item.title}
                              {item.badge && <Badge variant="danger" size="sm">{item.badge}</Badge>}
                            </div>
                            {item.subtitle && <div className="text-[11px] text-gray-400">{item.subtitle}</div>}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Command Footer */}
        <div className="p-3 bg-surface/80 border-t border-border flex items-center justify-between text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-accent" />
            <span>KSP Command Palette</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press <kbd className="bg-card px-1.5 py-0.5 rounded border border-border">ESC</kbd> to close</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
