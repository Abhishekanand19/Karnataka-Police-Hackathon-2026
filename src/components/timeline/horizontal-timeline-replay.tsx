"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FileCheck,
  UserCheck,
  ShieldAlert,
  CreditCard,
  GitFork,
  Landmark,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  User,
  Paperclip,
} from "lucide-react";

export interface TimelineEvent {
  id: string;
  stepNumber: number;
  date: string;
  time: string;
  title: string;
  officer: string;
  location: string;
  summary: string;
  category: "FIR" | "Statement" | "Evidence" | "Suspect" | "Financial" | "Network" | "Arrest" | "Chargesheet" | "Court";
  icon: React.ElementType;
  evidenceCount: number;
  connectedEntities: string[];
}

export const mockTimelineEvents: TimelineEvent[] = [
  { id: "evt-01", stepNumber: 1, date: "14 Jan 2026", time: "10:15 IST", title: "Complaint Filed", officer: "Constable R. Gowda", location: "HSR Layout PS", summary: "Complainant Anand Sharma files initial theft report regarding unauthorized bank debit and unreturned rented laptop.", category: "FIR", icon: FileCheck, evidenceCount: 2, connectedEntities: ["Anand Sharma (Victim)", "Canara Bank A/C"] },
  { id: "evt-02", stepNumber: 2, date: "14 Jan 2026", time: "14:30 IST", title: "FIR Registered (FIR-2026-00491)", officer: "Inspector V. Patil", location: "HSR Layout PS", summary: "Official FIR registered under Section 420 & IPC 379. Allocated to Special Crime Branch Team.", category: "FIR", icon: FileCheck, evidenceCount: 4, connectedEntities: ["FIR-2026-00491", "Inspector V. Patil"] },
  { id: "evt-03", stepNumber: 3, date: "15 Jan 2026", time: "11:00 IST", title: "Victim Statement Recorded", officer: "Sub-Inspector M. Nayak", location: "HSR Layout PS", summary: "Detailed victim statement captured regarding fake bank caller pretending to verify OTP for KYC update.", category: "Statement", icon: UserCheck, evidenceCount: 3, connectedEntities: ["Anand Sharma", "+91 98450 11029"] },
  { id: "evt-04", stepNumber: 4, date: "16 Jan 2026", time: "16:45 IST", title: "Bank Telecommunication Evidence Collected", officer: "Cyber Cell Analyst K. Rao", location: "Cyber Crime Cell", summary: "Call Data Records (CDR) & Bank Mule Account 948102841 logs extracted. Money transferred to local withdrawal point.", category: "Evidence", icon: CreditCard, evidenceCount: 6, connectedEntities: ["Mule A/C 948102841", "Canara Bank"] },
  { id: "evt-05", stepNumber: 5, date: "18 Jan 2026", time: "09:30 IST", title: "Prime Suspect Identified (Rajesh Kumar)", officer: "Inspector V. Patil", location: "Bengaluru Urban", summary: "Graph engine correlates phone number +91 98450 11029 to repeat offender Rajesh Kumar (Suspect #A-901).", category: "Suspect", icon: ShieldAlert, evidenceCount: 5, connectedEntities: ["Rajesh Kumar (A-901)", "Repeat Offender DB"] },
  { id: "evt-06", stepNumber: 6, date: "20 Jan 2026", time: "13:15 IST", title: "Secondary FIR Link Discovered", officer: "Analyst R. Kumar", location: "Indiranagar PS", summary: "Indiranagar PS burglaries (FIR-2026-00488) linked via shared getaway motorcycle registration KA-01-MJ-8910.", category: "Network", icon: GitFork, evidenceCount: 8, connectedEntities: ["FIR-2026-00488", "KA-01-MJ-8910"] },
  { id: "evt-07", stepNumber: 7, date: "22 Jan 2026", time: "04:30 IST", title: "Arrest Executed (Suspect #A-901)", officer: "Special Task Force", location: "Indiranagar Sector 3", summary: "Joint early morning raid captures Suspect #A-901 and co-accused Suresh V. Seized ₹2.8L cash and crowbar tools.", category: "Arrest", icon: ShieldAlert, evidenceCount: 9, connectedEntities: ["Rajesh Kumar", "Suresh V. (A-402)"] },
  { id: "evt-08", stepNumber: 8, date: "25 Jan 2026", time: "11:30 IST", title: "Judicial Chargesheet Submitted", officer: "Inspector V. Patil", location: "1st ACMM Court Bengaluru", summary: "Final 120-page audited chargesheet submitted in 1st ACMM Court with 9 supporting forensic attachments.", category: "Chargesheet", icon: Landmark, evidenceCount: 12, connectedEntities: ["1st ACMM Court", "Judicial Register #410"] },
];

export interface HorizontalTimelineReplayProps {
  onSelectEvent?: (event: TimelineEvent) => void;
}

export const HorizontalTimelineReplay: React.FC<HorizontalTimelineReplayProps> = ({
  onSelectEvent,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeEvent = mockTimelineEvents[activeStepIndex];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => {
          const next = prev + 1;
          if (next >= mockTimelineEvents.length) {
            setIsPlaying(false);
            return prev;
          }
          if (onSelectEvent) onSelectEvent(mockTimelineEvents[next]);
          return next;
        });
      }, 2000 / speedMultiplier);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speedMultiplier, onSelectEvent]);

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    if (onSelectEvent) onSelectEvent(mockTimelineEvents[index]);
  };

  const handleNext = () => {
    if (activeStepIndex < mockTimelineEvents.length - 1) {
      handleStepClick(activeStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      handleStepClick(activeStepIndex - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    handleStepClick(0);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Timeline Controls Toolbar */}
      <div className="p-3 bg-card/90 border border-card-border rounded-xl shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRestart}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Restart
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={activeStepIndex === 0}
            onClick={handlePrev}
            icon={<SkipBack className="w-3.5 h-3.5" />}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlaying ? "Pause" : "Play Sequence"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={activeStepIndex === mockTimelineEvents.length - 1}
            onClick={handleNext}
            icon={<SkipForward className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Speed & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-300 font-mono">
            <span className="text-gray-400">Speed:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded ${
                  speedMultiplier === spd
                    ? "bg-primary text-white font-bold"
                    : "bg-surface text-gray-400 hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-border/60 pl-3">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.3))}
              className="p-1 text-gray-400 hover:text-white rounded"
              title="Zoom Timeline"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
              className="p-1 text-gray-400 hover:text-white rounded"
              title="Zoom Out Timeline"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Track */}
      <div className="relative p-6 bg-surface/80 border border-border rounded-xl shadow-2xl overflow-x-auto">
        <div
          className="relative min-w-[760px] flex items-center justify-between py-6 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "left center" }}
        >
          {/* Progress Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-border/80 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-4 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-300"
            style={{
              width: `${(activeStepIndex / (mockTimelineEvents.length - 1)) * 95}%`,
            }}
          />

          {/* Milestone Event Nodes */}
          {mockTimelineEvents.map((event, idx) => {
            const isSelected = idx === activeStepIndex;
            const isPassed = idx <= activeStepIndex;
            const Icon = event.icon;

            return (
              <div
                key={event.id}
                onClick={() => handleStepClick(idx)}
                className="relative flex flex-col items-center cursor-pointer group z-10"
              >
                {/* Event Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isSelected
                      ? "bg-primary border-white text-white scale-125 shadow-[0_0_20px_rgba(37,99,235,0.8)] ring-4 ring-primary/40"
                      : isPassed
                      ? "bg-surface border-primary text-primary"
                      : "bg-surface border-border text-gray-500 hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Milestone Node Label */}
                <div className="mt-3 text-center space-y-0.5">
                  <div className="text-[10px] font-mono text-gray-400">{event.date}</div>
                  <div
                    className={`text-xs font-semibold max-w-[90px] truncate ${
                      isSelected ? "text-primary font-bold" : "text-gray-300"
                    }`}
                  >
                    {event.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Large Event Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEvent.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <Card glass className="p-6 space-y-4 border-primary/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="accent" size="sm">
                    Step #{activeEvent.stepNumber} of {mockTimelineEvents.length}
                  </Badge>
                  <span className="text-xs font-mono text-gray-400">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-primary" />
                    {activeEvent.date} • {activeEvent.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{activeEvent.title}</h3>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <User className="w-4 h-4 text-accent" />
                  <span>Officer: <strong>{activeEvent.officer}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 border-l border-border pl-3">
                  <MapPin className="w-4 h-4 text-semantic-danger" />
                  <span>Location: <strong>{activeEvent.location}</strong></span>
                </div>
              </div>
            </div>

            {/* Event Summary */}
            <p className="text-xs text-gray-200 leading-relaxed bg-surface/70 p-4 rounded-xl border border-border">
              {activeEvent.summary}
            </p>

            {/* Connected Entities & Attachments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-2">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-primary" /> Connected Entities ({activeEvent.connectedEntities.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeEvent.connectedEntities.map((entity) => (
                    <Badge key={entity} variant="neutral" size="sm" className="font-mono">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-accent" /> Evidentiary Attachments ({activeEvent.evidenceCount})
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-gray-300">
                  <span className="px-2 py-1 bg-surface rounded border border-border">CDR_Log_01.pdf</span>
                  <span className="px-2 py-1 bg-surface rounded border border-border">Bank_Mule_Entry.csv</span>
                  <span className="text-primary hover:underline cursor-pointer">+ {activeEvent.evidenceCount - 2} more</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
