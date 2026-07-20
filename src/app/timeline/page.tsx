"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { CaseHeaderBar } from "@/components/timeline/case-header-bar";
import { HorizontalTimelineReplay, TimelineEvent } from "@/components/timeline/horizontal-timeline-replay";
import { CaseExplorerSidebar, TimelineCaseItem, mockTimelineCases } from "@/components/timeline/case-explorer-sidebar";
import { CaseIntelligencePanel } from "@/components/timeline/case-intelligence-panel";
import { EvidenceFeedDrawer } from "@/components/timeline/evidence-feed-drawer";
import { InvestigationNotesPanel } from "@/components/timeline/investigation-notes-panel";
import { Clock, Play, FileText, ShieldAlert, Users, FolderCheck, Download, Plus } from "lucide-react";

export default function TimelinePage() {
  const [selectedCase, setSelectedCase] = useState<TimelineCaseItem>(mockTimelineCases[0]);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Page Header */}
      <PageHeader
        title="Investigation Timeline & Case Intelligence Workspace"
        description="Chronological replay engine tracking multi-incident cases from initial complaint to judicial chargesheet submission."
        badge={
          <Badge variant="accent">
            <Clock className="w-3.5 h-3.5 mr-1" /> Replay Engine
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FolderCheck className="w-3.5 h-3.5" />}
              onClick={() => setEvidenceDrawerOpen(true)}
            >
              Open Evidence Feed
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert("Dossier Brief Export initiated...")}
            >
              Export Case Dossier
            </Button>
          </div>
        }
      />

      {/* Top Case Header Bar */}
      <CaseHeaderBar />

      {/* Investigation KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Case Progress"
          value="92%"
          description="Chargesheet Filed"
          trend={{ value: "8%", direction: "up", label: "completed" }}
          icon={<FolderCheck className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Evidentiary Assets"
          value="12"
          description="Verified Records"
          icon={<FileText className="w-4 h-4 text-accent" />}
        />
        <StatCard
          title="Suspects Identified"
          value="2"
          description="Arrested in Custody"
          icon={<ShieldAlert className="w-4 h-4 text-semantic-danger" />}
        />
        <StatCard
          title="Witness Statements"
          value="3"
          description="Sworn Records"
          icon={<Users className="w-4 h-4 text-semantic-success" />}
        />
        <StatCard
          title="Linked FIR Cases"
          value="2"
          description="Indiranagar Ring"
          icon={<FileText className="w-4 h-4 text-purple-400" />}
        />
        <StatCard
          title="Milestone Events"
          value="8"
          description="Replay Sequence"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* 5-Section Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start relative">
        {/* Left Case Explorer Sidebar */}
        <CaseExplorerSidebar
          selectedCaseId={selectedCase.id}
          onSelectCase={(c) => setSelectedCase(c)}
        />

        {/* Center Timeline Replay Workspace */}
        <div className="flex-1 w-full space-y-4">
          <HorizontalTimelineReplay />
          <InvestigationNotesPanel />
        </div>

        {/* Right Case Intelligence Panel */}
        <CaseIntelligencePanel />
      </div>

      {/* Bottom Evidence Feed Drawer */}
      <EvidenceFeedDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
      />
    </div>
  );
}
