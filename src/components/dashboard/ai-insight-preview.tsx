"use client";

import React from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, FileText, ArrowRight, ShieldCheck } from "lucide-react";

export const AiInsightPreview: React.FC = () => {
  return (
    <Panel
      title="Automated Intelligence Briefing (AI Copilot Preview)"
      action={
        <Badge variant="accent" size="sm">
          <Sparkles className="w-3 h-3 mr-1" /> Evidence-Backed Reasoning
        </Badge>
      }
    >
      <div className="p-4 rounded-xl bg-surface/80 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Daily Operational Summary</span>
          </div>
          <Badge variant="info" size="sm">
            Confidence: High (94%)
          </Badge>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed">
          Statewide crime intelligence indicates an emerging property theft cluster in <strong className="text-white">Bengaluru Urban (Indiranagar PS)</strong> with 4 linked FIRs sharing matching forced-entry MO. Meanwhile, <strong className="text-white">Mysuru City</strong> reports a 74.0% clearance rate across recent robbery complaints.
        </p>

        <div className="p-2.5 bg-background rounded-lg border border-border/60 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
          <span className="font-semibold text-accent flex items-center gap-1">
            <FileText className="w-3 h-3" /> Citations:
          </span>
          <Badge variant="neutral" size="sm" className="font-mono">FIR-2026-00491</Badge>
          <Badge variant="neutral" size="sm" className="font-mono">FIR-2026-00488</Badge>
          <Badge variant="neutral" size="sm" className="font-mono">FIR-2026-00485</Badge>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-[11px] text-semantic-success font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Checked against 15,420 ERD FIR Records
          </div>
          <Link href="/copilot">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Full AI Copilot
            </Button>
          </Link>
        </div>
      </div>
    </Panel>
  );
};
