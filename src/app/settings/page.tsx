"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Moon,
  Maximize2,
  Bell,
  Zap,
  Eye,
  ShieldCheck,
  Check,
  User,
  Key,
  Database,
  Sliders,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"appearance" | "notifications" | "performance" | "accessibility" | "security">("appearance");
  const [saved, setSaved] = useState(false);

  // Settings State
  const [commandModeDefault, setCommandModeDefault] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Page Header */}
      <PageHeader
        title="System Preferences & Command Centre Settings"
        description="Configure operational display modes, security credentials, notification rules, and accessibility preferences."
        badge={
          <Badge variant="neutral">
            <Settings className="w-3.5 h-3.5 mr-1" /> Enterprise Config
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={saved ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Check className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            {saved ? "Preferences Saved" : "Save Changes"}
          </Button>
        }
      />

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-card/80 border border-card-border p-1.5 rounded-2xl overflow-x-auto text-xs">
        {[
          { id: "appearance", label: "Appearance & Theme", icon: Moon },
          { id: "notifications", label: "Notifications & Alerts", icon: Bell },
          { id: "performance", label: "Performance & Motion", icon: Zap },
          { id: "accessibility", label: "Accessibility", icon: Eye },
          { id: "security", label: "Officer Security & Audit", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content Workspace */}
      <div className="max-w-4xl space-y-4">
        {activeTab === "appearance" && (
          <Panel title="Appearance & Layout Preferences">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-surface/60 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-primary" /> Command Center Mode Default
                  </div>
                  <div className="text-gray-400">
                    Automatically expand workspace canvas and collapse sidebars on application launch.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={commandModeDefault}
                  onChange={(e) => setCommandModeDefault(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="p-3 bg-surface/60 rounded-xl border border-border space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-accent" /> Active Theme Token Palette
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-[#0B1220] border border-border text-center">
                    Background (#0B1220)
                  </div>
                  <div className="p-2 rounded bg-[#111827] border border-border text-center">
                    Surface (#111827)
                  </div>
                  <div className="p-2 rounded bg-[#1F2937] border border-border text-center">
                    Card (#1F2937)
                  </div>
                  <div className="p-2 rounded bg-[#2563EB] text-white text-center">
                    Primary (#2563EB)
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        )}

        {activeTab === "notifications" && (
          <Panel title="Notification & Critical Alert Rules">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-surface/60 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-accent" /> Auditory Alert Effects
                  </div>
                  <div className="text-gray-400">
                    Play synthesized chime on Critical Hotspot spikes and high-risk suspect detection.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Panel>
        )}

        {activeTab === "performance" && (
          <Panel title="Performance & Graphics Engine Settings">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-surface/60 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-semantic-warning" /> Framer Motion Transitions
                  </div>
                  <div className="text-gray-400">Enable high-framerate route transitions and drawer animations.</div>
                </div>
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Panel>
        )}

        {activeTab === "accessibility" && (
          <Panel title="Accessibility & ARIA Preferences">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-surface/60 rounded-xl border border-border">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-semantic-success" /> High Contrast Mode
                  </div>
                  <div className="text-gray-400">Increase border contrast ratio across map overlays and network nodes.</div>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Panel>
        )}

        {activeTab === "security" && (
          <Panel title="Officer Credentials & Catalyst Audit Logs">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface/70 rounded-xl border border-border space-y-1">
                <div className="text-[10px] text-gray-400 font-mono uppercase">Logged Officer Badge</div>
                <div className="font-bold text-white text-sm">Inspector V. Patil (Badge #KSP-894102)</div>
                <div className="text-[11px] text-primary font-mono">Special Crime Branch • Bengaluru Urban</div>
              </div>

              <div className="p-3 bg-surface/70 rounded-xl border border-border space-y-1 font-mono text-[11px]">
                <div className="text-[10px] text-gray-400 uppercase">Zoho Catalyst Stratus Hash</div>
                <div className="text-gray-300">0x8F4A901B2C3D4E5F6A7B8C9D0E1F2A3B</div>
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
