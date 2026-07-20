"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { FileText, MapPin, Shield, User, Clock, ShieldAlert } from "lucide-react";

export const CaseHeaderBar: React.FC = () => {
  return (
    <div className="p-4 bg-card/90 border border-card-border rounded-2xl shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none">
      {/* Case Details */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" size="sm" className="font-mono text-xs font-bold">
            FIR-2026-00491
          </Badge>
          <RiskBadge level="Critical" score={89} />
          <Badge variant="danger" size="sm">P1 High Priority</Badge>
          <Badge variant="success" size="sm">Chargesheet Submitted</Badge>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">
          ₹4.2L Cyber Phishing & Property Burglary Case
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Bengaluru Urban
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-accent" /> HSR Layout PS
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-semantic-success" /> Lead: Inspector V. Patil
          </span>
        </div>
      </div>

      {/* Last Updated & Audit Stamp */}
      <div className="flex flex-col items-end gap-1 text-xs font-mono shrink-0">
        <div className="flex items-center gap-1 text-gray-300 bg-surface px-3 py-1.5 rounded-xl border border-border">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Last Updated: 25 Jan 2026 11:30 IST</span>
        </div>
        <span className="text-[10px] text-gray-500">KSP SCRB Case Docket Hash: #8F4A-491</span>
      </div>
    </div>
  );
};
