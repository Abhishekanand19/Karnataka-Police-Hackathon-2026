"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { InvestigationHeader } from "@/components/copilot/investigation-header";
import { CopilotSidebar, mockSessions, SessionItem } from "@/components/copilot/copilot-sidebar";
import { InvestigationCard, InvestigationMessage } from "@/components/copilot/investigation-card";
import { EvidencePanel } from "@/components/copilot/evidence-panel";
import { PromptInputPanel } from "@/components/copilot/prompt-input-panel";
import { Bot, Sparkles, RefreshCw, Plus, ShieldCheck, FileText } from "lucide-react";

const initialMessages: InvestigationMessage[] = [
  {
    id: "msg-01",
    sender: "copilot",
    timestamp: "16:20:14 IST",
    summary:
      "Statewide crime intelligence indicates an emerging property theft & cyber fraud cluster in Bengaluru Urban (Indiranagar & HSR Layout PS). 4 linked FIRs registered between July 12 and July 18, 2026 share matching forced-entry MO and mule bank account contacts.",
    reasoning:
      "Cross-referencing ERD CaseMaster and Accused tables reveals Suspect #A-901 (Rajesh Kumar) linked to 2 phishing complaints, while co-accused Suspect #A-402 (Suresh V.) shares getaway motorcycle registration KA-01-MJ-8910.",
    confidence: "High",
    confidenceScore: 94,
    district: "Bengaluru Urban",
    hotspotName: "Indiranagar Property Theft Zone",
    citedFirs: [
      { id: "FIR-2026-00491", title: "₹4.2L Phishing Scam", district: "Bengaluru Urban", risk: "Critical" },
      { id: "FIR-2026-00488", title: "Indiranagar Night Theft", district: "Bengaluru Urban", risk: "High" },
      { id: "FIR-2026-00485", title: "Commercial Office Burglary", district: "Bengaluru Urban", risk: "High" },
    ],
    followUpQuestions: [
      "Explain network relationships for Suspect #A-901",
      "Show repeat offenders in Indiranagar PS",
      "Compare Mysuru vs. Bengaluru Urban clearance rate",
    ],
  },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<InvestigationMessage[]>(initialMessages);
  const [selectedSession, setSelectedSession] = useState<SessionItem>(mockSessions[0]);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>("FIR-2026-00491");
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = (promptText: string) => {
    // Append user query message
    const userMsg: InvestigationMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      queryText: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Simulate structured AI Copilot Investigation Response
    setTimeout(() => {
      setLoading(false);
      const aiResponse: InvestigationMessage = {
        id: `copilot-${Date.now()}`,
        sender: "copilot",
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        summary: `Analytical Briefing for query: "${promptText}". Synthesized 3 linked FIR records across Bengaluru Urban with 92% evidence confidence score.`,
        reasoning:
          "Evidence synthesis from Karnataka Police ERD confirms 4 co-occurring Modus Operandi matches. Suspect accounts are registered under HSR Layout jurisdiction.",
        confidence: "High",
        confidenceScore: 92,
        district: "Bengaluru Urban",
        citedFirs: [
          { id: "FIR-2026-00491", title: "₹4.2L Phishing Scam", district: "Bengaluru Urban", risk: "Critical" },
          { id: "FIR-2026-00488", title: "Indiranagar Night Theft", district: "Bengaluru Urban", risk: "High" },
        ],
        followUpQuestions: [
          "Explain repeat offender networks",
          "Open spatial hotspot analysis",
          "Generate executive PDF dossier",
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 700);
  };

  const handleNewSession = () => {
    setMessages([]);
    setActiveEvidenceId(null);
  };

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Page Header */}
      <PageHeader
        title="AI Investigator Copilot & Decision Support Workspace"
        description="Evidence-backed automated intelligence reasoning assistant. Strictly bound by Karnataka Police FIR records with 0% hallucination guardrails."
        badge={
          <Badge variant="accent">
            <Bot className="w-3.5 h-3.5 mr-1" /> Decision Support Engine
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleNewSession}
            >
              New AI Session
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => alert("Generating Executive Briefing...")}
            >
              Generate Brief
            </Button>
          </div>
        }
      />

      {/* Top Context Header */}
      <InvestigationHeader />

      {/* 5-Region Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start relative">
        {/* Region 1: Left Sessions Sidebar */}
        <CopilotSidebar
          selectedSessionId={selectedSession.id}
          onSelectSession={(s) => setSelectedSession(s)}
          onNewSession={handleNewSession}
        />

        {/* Region 2 & 3: Center Workspace & Bottom Input Panel */}
        <div className="flex-1 w-full space-y-4 flex flex-col justify-between min-h-[620px]">
          {/* Conversation Workspace Area */}
          <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-3">
            {messages.length === 0 ? (
              <EmptyState
                icon={<Bot className="w-10 h-10 text-accent stroke-[1.5]" />}
                title="No Active Investigation Selected"
                description="Ask AI Copilot to explain emerging hotspots, summarize FIR evidence, or select a suggested prompt below."
                actionLabel="Ask Default Query"
                onAction={() => handlePromptSubmit("Explain the Indiranagar property theft hotspot & cited FIRs")}
                className="my-12 py-12"
              />
            ) : (
              messages.map((msg) => (
                <InvestigationCard
                  key={msg.id}
                  message={msg}
                  onSelectEvidence={(firId) => setActiveEvidenceId(firId)}
                  onSelectFollowUp={(q) => handlePromptSubmit(q)}
                />
              ))
            )}

            {loading && (
              <div className="p-4 bg-surface/60 border border-border/60 rounded-2xl animate-pulse space-y-2 text-xs">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Sparkles className="w-4 h-4 animate-spin" /> Copilot Synthesizing ERD Evidence...
                </div>
                <div className="h-4 bg-gray-700/40 rounded w-3/4" />
                <div className="h-4 bg-gray-700/40 rounded w-1/2" />
              </div>
            )}
          </div>

          {/* Region 4: Bottom Input Panel */}
          <PromptInputPanel
            onSubmitPrompt={handlePromptSubmit}
            onClearConversation={handleNewSession}
            onGenerateBrief={() => alert("Generating Executive Briefing...")}
          />
        </div>

        {/* Region 5: Right Evidence Panel */}
        <EvidencePanel
          activeEvidenceId={activeEvidenceId}
          onSelectEvidence={(firId) => setActiveEvidenceId(firId)}
        />
      </div>
    </div>
  );
}
