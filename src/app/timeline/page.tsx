"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Play, SkipBack, SkipForward, Clock, FileCheck } from "lucide-react";

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Investigation Timeline Replay"
        description="Chronological step-by-step replay illustrating how multi-incident investigations evolved from initial FIR registration to arrest."
        badge={<Badge variant="info">Phase 8 Feature Ready</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<SkipBack className="w-4 h-4" />}>
              Rewind
            </Button>
            <Button variant="primary" icon={<Play className="w-4 h-4" />}>
              Play Sequence
            </Button>
            <Button variant="secondary" icon={<SkipForward className="w-4 h-4" />}>
              Forward
            </Button>
          </div>
        }
      />

      <Panel title="Chronological Investigation Flow (Case Cluster #842)">
        <div className="relative border-l-2 border-primary/40 ml-4 pl-6 space-y-6 py-2">
          {[
            { date: "Day 1 - 14 Jan 2026", title: "Initial Complaint Registered", desc: "Complainant files FIR-2026-00102 at Indiranagar PS regarding night burglary.", icon: FileCheck },
            { date: "Day 3 - 16 Jan 2026", title: "Second Incident Linked", desc: "Matching MO reported at HSR Layout PS (FIR-2026-00105). Shared vehicle identified.", icon: History },
            { date: "Day 6 - 19 Jan 2026", title: "Suspect Identified via Network Graph", desc: "Graph engine connects repeat offender Suspect #A-901 based on past arrest record.", icon: Clock },
            { date: "Day 12 - 25 Jan 2026", title: "Arrest & Chargesheet Submitted", desc: "Arrest executed by Special Task Force. Chargesheet filed in Judicial Court.", icon: FileCheck },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0.5 p-1.5 rounded-full bg-surface border-2 border-primary text-primary shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="p-4 bg-surface/60 rounded-xl border border-border space-y-1">
                  <div className="text-[11px] font-mono font-semibold text-primary">{step.date}</div>
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
