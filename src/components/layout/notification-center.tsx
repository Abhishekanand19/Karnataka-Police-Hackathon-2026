"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ShieldAlert, CheckCircle2, Info, Search, Check, Filter } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info" | "event";
  timestamp: string;
  read: boolean;
  district?: string;
}

export const mockNotifications: NotificationItem[] = [
  { id: "not-01", title: "Critical Hotspot Spike: Indiranagar", message: "Property theft incidents surpassed +45% threshold in Sector 3.", type: "critical", timestamp: "10 mins ago", read: false, district: "Bengaluru Urban" },
  { id: "not-02", title: "New Accused Network Link", message: "Graph engine linked Suspect #A-901 to Canara Bank Mule A/C 948102841.", type: "warning", timestamp: "35 mins ago", read: false, district: "Bengaluru Urban" },
  { id: "not-03", title: "Judicial Chargesheet Submitted", message: "Inspector V. Patil submitted 120-page chargesheet for FIR-2026-00491.", type: "info", timestamp: "2 hours ago", read: true, district: "Bengaluru Urban" },
  { id: "not-04", title: "Statewide Crime Intelligence Sync", message: "SCRB Database synchronized 1,420 synthetic FIR records.", type: "event", timestamp: "4 hours ago", read: true },
];

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = items.filter((i) => !i.read).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  const filtered = items.filter((i) => filter === "all" || i.type === filter);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Command Centre Notification Feed"
      size="md"
    >
      <div className="space-y-4 text-xs select-none">
        {/* Header Actions & Unread Counter */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Alert Queue</span>
            {unreadCount > 0 && <Badge variant="danger" size="sm">{unreadCount} New</Badge>}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            icon={<Check className="w-3.5 h-3.5 text-semantic-success" />}
          >
            Mark All Read
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-xl overflow-x-auto text-[11px]">
          {[
            { id: "all", label: "All Alerts" },
            { id: "critical", label: "Critical" },
            { id: "warning", label: "Warnings" },
            { id: "info", label: "Updates" },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === chip.id ? "bg-primary text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all space-y-1 ${
                !item.read
                  ? "bg-primary/10 border-primary/40"
                  : "bg-surface/50 border-border opacity-75"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{item.title}</span>
                <span className="font-mono text-[10px] text-gray-400">{item.timestamp}</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">{item.message}</p>
              {item.district && (
                <div className="text-[10px] font-mono text-primary pt-1">{item.district}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
