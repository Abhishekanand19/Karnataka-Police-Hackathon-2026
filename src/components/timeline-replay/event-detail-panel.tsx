"use client";

import React from "react";
import { TimelineEvent } from "@/lib/mock-database";
import { 
  X, FileText, Image as ImageIcon,
  AlertTriangle, Crosshair, ArrowRight, Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

interface EventDetailPanelProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({ event, onClose }) => {
  const router = useRouter();
  if (!event) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[420px] bg-[#101827]/95 backdrop-blur-xl shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.5)] z-20 flex flex-col transform transition-transform duration-300">
      
      {/* Header */}
      <div className="p-6 flex items-start justify-between bg-card/30">
        <div>
          <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mb-1">
            {event.date} • {event.time}
          </div>
          <div className="text-xs font-semibold text-primary mb-2">Evidence Inspector</div>
          <h2 className="text-[18px] font-semibold text-white leading-7">{event.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-card hover:bg-card-hover rounded-full text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-7">
        
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Officer</h3>
          <p className="text-[15px] text-gray-300">{event.officer} · {event.date}, {event.time}</p>
        </div>

        {/* AI Insights */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> AI Insight
            </div>
            <div className="text-[10px] font-bold text-semantic-success flex items-center gap-1">
              <Activity className="w-3 h-3" /> 94% Conf
            </div>
          </div>
          <p className="text-[15px] text-gray-200 leading-6 italic border-l-2 border-primary/50 pl-3">
            This event represents a critical escalation. The physical evidence recovered strongly links the suspect to 3 other unresolved cases in the district.
          </p>
          <div className="pt-2 border-t border-primary/20">
            <span className="text-xs font-semibold text-primary">Suggested next step</span>
            <div className="text-[15px] text-white mt-1">Cross-reference seized laptops with Cyber Cell hash database.</div>
          </div>
        </div>

        {/* Evidence & Attachments */}
        {event.attachments && event.attachments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Evidence</h3>
            <div className="grid grid-cols-2 gap-2">
              {event.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-card border border-border/80 rounded-lg group cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="w-8 h-8 rounded bg-surface flex items-center justify-center shrink-0">
                    {att.endsWith('.jpg') || att.endsWith('.png') ? (
                      <ImageIcon className="w-4 h-4 text-accent" />
                    ) : (
                      <FileText className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-300 truncate group-hover:text-white">{att}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Entities */}
        {event.connectedEntities && event.connectedEntities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Related entities</h3>
            <div className="space-y-2">
              {event.connectedEntities.map((ent, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-card/40 border border-border/50 rounded-lg">
                  <span className="text-xs font-semibold text-white">{ent}</span>
                  <Crosshair className="w-3.5 h-3.5 text-gray-500" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Navigation */}
      <div className="p-5 bg-card/30 space-y-2">
        <button 
          onClick={() => router.push("/network")}
          className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-card-hover rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Explore in Network <ArrowRight className="w-4 h-4 text-gray-500" />
        </button>
        <button 
          onClick={() => router.push("/copilot")}
          className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-card-hover rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Analyze in Copilot <ArrowRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

    </div>
  );
};
