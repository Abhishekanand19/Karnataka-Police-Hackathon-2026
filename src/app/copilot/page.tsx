"use client";

import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function CopilotPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Investigator Copilot"
        description="Evidence-backed intelligence reasoning assistant. Strictly bound by Karnataka Police FIR records with 0% hallucination guardrails."
        badge={<Badge variant="accent">Explainable AI</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <Panel title="Intelligence Copilot Dialogue" className="h-[520px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Bot Welcome Message */}
              <div className="flex gap-3 p-4 rounded-xl bg-surface/70 border border-border">
                <div className="p-2 rounded-lg bg-accent/20 text-accent h-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Investigator Copilot</span>
                    <Badge variant="success" size="sm">Evidence Guard active</Badge>
                  </div>
                  <p className="leading-relaxed">
                    Greetings Officer Patil. I am your evidence-backed investigation assistant. Ask me to explain emerging hotspots, evaluate district risk scores, or trace connected repeat offenders.
                  </p>
                  <div className="pt-2 border-t border-border/40 text-[11px] text-gray-400">
                    <span className="font-mono text-accent">Rulebook Policy:</span> Every response is strictly linked to verified FIR IDs, dates, and locations.
                  </div>
                </div>
              </div>

              {/* Sample User Query Placeholder */}
              <div className="flex gap-3 p-4 rounded-xl bg-card border border-primary/30 ml-8">
                <div className="space-y-1 text-xs text-gray-200 flex-1">
                  <div className="font-semibold text-primary">Officer Query</div>
                  <p>Why is Bengaluru Urban flagged with a High Risk Score this week?</p>
                </div>
              </div>

              {/* Sample Evidence-backed Response */}
              <div className="flex gap-3 p-4 rounded-xl bg-surface/70 border border-border">
                <div className="p-2 rounded-lg bg-accent/20 text-accent h-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Evidence-backed Explanation</span>
                    <Badge variant="info" size="sm">Confidence: High (94%)</Badge>
                  </div>
                  <p>
                    Bengaluru Urban risk index increased due to 4 linked cyber fraud incidents registered under HSR Layout & Indiranagar PS between July 12 and July 18, 2026.
                  </p>
                  <div className="p-2.5 bg-background rounded-lg border border-border space-y-1 text-[11px]">
                    <div className="font-semibold text-accent flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Cited Evidence:
                    </div>
                    <div>• FIR-2026-00491 (HSR Layout PS) - ₹4.2L Phishing Scam</div>
                    <div>• FIR-2026-00488 (Indiranagar PS) - Social Engineering</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-border mt-4">
              <Input placeholder="Ask Copilot about any district, case, or hotspot..." className="flex-1" />
              <Button variant="primary" icon={<Send className="w-4 h-4" />}>
                Send
              </Button>
            </div>
          </Panel>
        </div>

        {/* Right Guidance Panel */}
        <div className="space-y-4">
          <Panel title="Suggested Prompt Queries">
            <div className="space-y-2 text-xs">
              {[
                "Why is Bengaluru Urban high risk?",
                "Explain the Indiranagar theft hotspot",
                "Find similar cyber crime FIRs",
                "Summarize repeat offender profiles",
              ].map((query) => (
                <button
                  key={query}
                  className="w-full text-left p-2.5 rounded-lg bg-surface/50 border border-border/60 hover:border-primary hover:text-primary transition-colors flex items-center justify-between group"
                >
                  <span className="text-gray-300 group-hover:text-white">{query}</span>
                  <Sparkles className="w-3.5 h-3.5 text-gray-500 group-hover:text-accent" />
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="AI Safety Policy">
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                <span>No Guilt Prediction: AI never predicts guilt or orders arrests.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                <span>Evidence Requirement: Every answer cites FIR IDs and dates.</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
