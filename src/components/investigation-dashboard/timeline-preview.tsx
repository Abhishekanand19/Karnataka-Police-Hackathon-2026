"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { History, ArrowRight } from "lucide-react";

export const TimelinePreview: React.FC = () => {
  const router = useRouter();
  const { activeInvestigation } = useInvestigation();

  const events = useMemo(() => {
    return MOCK_DB.timelineEvents
      .filter(e => e.firId === activeInvestigation?.entityId)
      .sort((a, b) => b.stepNumber - a.stepNumber)
      .slice(0, 5); // Latest 5
  }, [activeInvestigation]);

  if (events.length === 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center h-full">
        <History className="w-10 h-10 text-gray-500 mb-3" />
        <h3 className="text-white font-bold mb-1">No Timeline Events</h3>
        <p className="text-sm text-gray-400">Investigation has not recorded any timeline events yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-sm">
          <History className="w-5 h-5 text-primary" /> Timeline Preview
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                {/* Marker */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-gray-400 group-hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-3 rounded-xl border border-border/50 bg-card/30 group-hover:bg-card/60 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{event.title}</span>
                    <span className="text-[10px] font-mono text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{event.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border/50 bg-card/10">
        <button
          onClick={() => router.push("/timeline")}
          className="w-full py-2.5 bg-card hover:bg-card-hover border border-border text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
        >
          Open Full Timeline <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};
