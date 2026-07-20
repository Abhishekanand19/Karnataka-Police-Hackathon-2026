"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Panel } from "@/components/ui/panel";
import { RiskBadge, RiskLevel } from "@/components/ui/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ShieldAlert, Clock, MapPin, ChevronRight, AlertTriangle } from "lucide-react";

export interface AlertItem {
  id: string;
  priority: "P1" | "P2" | "P3";
  title: string;
  district: string;
  policeStation: string;
  timeAgo: string;
  risk: RiskLevel;
  riskScore: number;
  description: string;
  firs: string[];
}

const mockAlerts: AlertItem[] = [
  {
    id: "ALT-2026-104",
    priority: "P1",
    title: "Indiranagar Nighttime Theft Cluster Triggered",
    district: "Bengaluru Urban",
    policeStation: "Indiranagar PS",
    timeAgo: "14 mins ago",
    risk: "Critical",
    riskScore: 89,
    description: "4 burglaries registered within 2.5km radius in the last 48 hours sharing matching forced entry MO.",
    firs: ["FIR-2026-00491", "FIR-2026-00488", "FIR-2026-00485"],
  },
  {
    id: "ALT-2026-103",
    priority: "P1",
    title: "Devaraja Market Organized Theft Network Detected",
    district: "Mysuru City",
    policeStation: "Devaraja PS",
    timeAgo: "1 hour ago",
    risk: "High",
    riskScore: 78,
    description: "Repeat offender Suspect #A-904 linked to 3 newly registered theft complaints via shared phone contacts.",
    firs: ["FIR-2026-00412", "FIR-2026-00410"],
  },
  {
    id: "ALT-2026-102",
    priority: "P2",
    title: "Cross-District Financial Cyber Scam Syndicate",
    district: "Dakshina Kannada",
    policeStation: "Panambur PS",
    timeAgo: "3 hours ago",
    risk: "High",
    riskScore: 72,
    description: "Multi-district phishing scam utilizing fake bank OTP calls reported across 5 victims.",
    firs: ["FIR-2026-00388"],
  },
];

export const EmergingAlertsFeed: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <Panel
      title="Emerging Operational Alerts"
      action={<Badge variant="danger">{mockAlerts.length} Active Alerts</Badge>}
    >
      <div className="space-y-3">
        {mockAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="p-3.5 bg-surface/70 border border-border/60 hover:border-gray-500/60 rounded-xl transition-all space-y-2 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={alert.priority === "P1" ? "danger" : "warning"} size="sm">
                  {alert.priority} Priority
                </Badge>
                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                  {alert.title}
                </span>
              </div>
              <RiskBadge level={alert.risk} score={alert.riskScore} />
            </div>

            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
              {alert.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-gray-300">
                  <MapPin className="w-3 h-3 text-primary" /> {alert.district} ({alert.policeStation})
                </span>
                <span className="flex items-center gap-1 font-mono text-gray-400">
                  <Clock className="w-3 h-3" /> {alert.timeAgo}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<ChevronRight className="w-3 h-3" />}
                onClick={() => setSelectedAlert(alert)}
              >
                Inspect
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alert Inspector Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title}
        description={`Alert ID: ${selectedAlert?.id} • Priority ${selectedAlert?.priority}`}
      >
        {selectedAlert && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">District / PS:</span>
                <span className="font-semibold text-white">{selectedAlert.district} • {selectedAlert.policeStation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Risk Assessment:</span>
                <RiskBadge level={selectedAlert.risk} score={selectedAlert.riskScore} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-white">Full Alert Briefing</div>
              <p className="text-gray-300 leading-relaxed bg-surface/50 p-3 rounded-xl border border-border/50">
                {selectedAlert.description}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-white">Associated FIR Records ({selectedAlert.firs.length})</div>
              <div className="flex flex-wrap gap-2">
                {selectedAlert.firs.map((fir) => (
                  <Badge key={fir} variant="accent" size="sm" className="font-mono">
                    {fir}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  );
};
