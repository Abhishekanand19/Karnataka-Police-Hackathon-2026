"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { InvestigationSummarySidebar } from "@/components/timeline-replay/investigation-summary-sidebar";
import { ReplayEngineCanvas } from "@/components/timeline-replay/replay-engine-canvas";
import { EventDetailPanel } from "@/components/timeline-replay/event-detail-panel";

export default function TimelinePage() {
  const { activeInvestigation, caseContext } = useInvestigation();
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const timelineEvents = useMemo(() => {
    return caseContext?.timeline || [];
  }, [caseContext]);

  const activeEvent = useMemo(() => {
    return timelineEvents.find(e => e.id === activeEventId) || null;
  }, [activeEventId, timelineEvents]);

  useEffect(() => setActiveEventId(null), [caseContext?.fir.firNumber]);

  if (!mounted) return <div className="page-loading">Preparing chronological reconstruction…</div>;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0a0c14]">
      
      {/* 25% Investigation Summary Sidebar */}
      <div className="w-[350px] shrink-0 h-full z-10 relative shadow-2xl">
        <InvestigationSummarySidebar />
      </div>

      {/* 75% Interactive Timeline Canvas */}
      <div className="flex-1 h-full min-w-0 relative">
        {activeInvestigation ? (
          <ReplayEngineCanvas 
            events={timelineEvents}
            activeEventId={activeEventId}
            onEventSelect={setActiveEventId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Please load an investigation from the workspace to view its timeline.
          </div>
        )}

        {/* Sliding Event Detail Panel */}
        <div className={`absolute top-0 right-0 bottom-0 z-20 transition-transform duration-300 ${activeEventId ? 'translate-x-0' : 'translate-x-full'}`}>
          <EventDetailPanel 
            event={activeEvent} 
            onClose={() => setActiveEventId(null)} 
          />
        </div>
      </div>

    </div>
  );
}
