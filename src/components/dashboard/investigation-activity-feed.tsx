"use client";

import React from "react";
import { Panel } from "@/components/ui/panel";
import { FileCheck, ShieldAlert, UserCheck, CheckCircle2, History } from "lucide-react";

export const InvestigationActivityFeed: React.FC = () => {
  const activities = [
    {
      id: "ACT-01",
      title: "New FIR Registered (Cyber Fraud)",
      desc: "FIR-2026-00491 filed at HSR Layout PS regarding ₹4.2L phishing scam.",
      time: "10 mins ago",
      icon: FileCheck,
      color: "border-primary text-primary",
    },
    {
      id: "ACT-02",
      title: "Repeat Offender Linked",
      desc: "Network engine associated Suspect #A-901 to 2 new burglary complaints.",
      time: "32 mins ago",
      icon: UserCheck,
      color: "border-accent text-accent",
    },
    {
      id: "ACT-03",
      title: "Hotspot Cluster Level Escalated",
      desc: "Indiranagar property theft zone risk score upgraded to Critical (89).",
      time: "1 hour ago",
      icon: ShieldAlert,
      color: "border-semantic-danger text-semantic-danger",
    },
    {
      id: "ACT-04",
      title: "Judicial Chargesheet Submitted",
      desc: "Chargesheet filed in Judicial First Class Magistrate Court for FIR-2026-00310.",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "border-semantic-success text-semantic-success",
    },
    {
      id: "ACT-05",
      title: "Investigation Closed",
      desc: "Case FIR-2026-00280 marked Solved following full stolen property recovery.",
      time: "4 hours ago",
      icon: History,
      color: "border-gray-500 text-gray-300",
    },
  ];

  return (
    <Panel title="Recent Investigation Activity Timeline">
      <div className="relative border-l-2 border-border/60 ml-3.5 pl-5 space-y-4 py-1">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative group">
              <div className={`absolute -left-[27px] top-0.5 p-1 rounded-full bg-surface border ${act.color}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white group-hover:text-primary transition-colors">
                    {act.title}
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">{act.time}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{act.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
