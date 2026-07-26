"use client";

import React, { useEffect, useRef, useState } from "react";
import { TimelineEvent } from "@/lib/mock-database";
import { 
  Play, Pause, ChevronLeft, ChevronRight, FastForward, 
  Search, Filter, Download, Printer, ShieldAlert
} from "lucide-react";

interface ReplayEngineCanvasProps {
  events: TimelineEvent[];
  activeEventId: string | null;
  onEventSelect: (eventId: string) => void;
}

export const ReplayEngineCanvas: React.FC<ReplayEngineCanvasProps> = ({ 
  events, 
  activeEventId, 
  onEventSelect 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Sort events chronologically (assuming they have stepNumber or date)
  const sortedEvents = [...events].sort((a, b) => a.stepNumber - b.stepNumber);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIndex = sortedEvents.findIndex(e => e.id === activeEventId);
        if (currentIndex < sortedEvents.length - 1) {
          const nextEvent = sortedEvents[currentIndex + 1];
          onEventSelect(nextEvent.id);
          
          // Scroll to the active event
          const el = document.getElementById(`event-${nextEvent.id}`);
          if (el && listRef.current) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          setIsPlaying(false);
        }
      }, 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeEventId, sortedEvents, onEventSelect, speed]);

  // Selecting an event is the replay camera movement: keep the selected
  // evidence point centred while the surrounding chronology recedes.
  useEffect(() => {
    if (!activeEventId) return;
    document.getElementById(`event-${activeEventId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeEventId]);

  const handlePrev = () => {
    const currentIndex = sortedEvents.findIndex(e => e.id === activeEventId);
    if (currentIndex > 0) {
      onEventSelect(sortedEvents[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = sortedEvents.findIndex(e => e.id === activeEventId);
    if (currentIndex < sortedEvents.length - 1) {
      onEventSelect(sortedEvents[currentIndex + 1].id);
    }
  };

  const handlePlayPause = () => {
    if (!activeEventId && sortedEvents.length > 0) {
      onEventSelect(sortedEvents[0].id);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-full relative bg-[#0a0c14]">
      
      {/* Replay controls */}
      <div className="absolute top-5 left-6 right-6 flex justify-between z-10 pointer-events-none">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-1 bg-surface/95 backdrop-blur-md rounded-xl p-1.5 shadow-xl pointer-events-auto">
          <button onClick={handlePrev} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button 
            onClick={handlePlayPause} 
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {isPlaying ? "Pause Replay" : "Play Replay"}
          </button>
          <button onClick={handleNext} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            Next <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-border/80 mx-1" />
          
          <div className="flex items-center gap-1 px-1" aria-label="Playback speed">
            <FastForward className="w-4 h-4 text-gray-500 mx-1" />
            {[1, 2, 4].map(value => <button key={value} onClick={() => setSpeed(value)} className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${speed === value ? "bg-card text-white" : "text-gray-500 hover:text-white"}`}>{value}x</button>)}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search timeline..."
              className="w-48 focus:w-64 bg-surface/90 backdrop-blur-md border border-border/80 focus:border-primary rounded-xl py-2 pl-9 pr-4 text-xs text-white shadow-xl outline-none transition-all placeholder:text-gray-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-surface/90 backdrop-blur-md border border-border/80 hover:border-primary/50 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors shadow-xl">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="flex items-center gap-1 bg-surface/90 backdrop-blur-md border border-border/80 rounded-xl p-1 shadow-xl ml-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-card rounded-lg transition-colors" title="Export PDF">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-card rounded-lg transition-colors" title="Print">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto px-6 md:px-20 pt-28 pb-32"
      >
        <div className="relative max-w-5xl mx-auto">
          {/* Main vertical line */}
          <div className="absolute left-[47px] top-5 bottom-8 w-[3px] bg-gradient-to-b from-primary via-primary/45 to-primary/10" />

          <div className="space-y-10">
            {sortedEvents.map((event, index) => {
              const isActive = activeEventId === event.id;
              const activeIndex = sortedEvents.findIndex(item => item.id === activeEventId);
              const isFuture = activeIndex !== -1 && index > activeIndex;
              const isPast = activeIndex !== -1 && index < activeIndex;
              const Icon = event.icon;
              
              return (
                <div 
                  key={event.id} 
                  id={`event-${event.id}`}
                  onClick={() => onEventSelect(event.id)}
                  className={`relative flex gap-6 cursor-pointer group transition-all duration-300 ${
                  isActive ? "opacity-100 scale-[1.01]" : isFuture ? "opacity-35 hover:opacity-80" : isPast ? "opacity-60 hover:opacity-100" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Timeline Dot & Line Connector */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className={`w-24 text-right pr-5 pt-2 font-mono text-sm font-semibold ${isActive ? "text-primary" : "text-gray-400"}`}>
                      {event.date}
                      <div className="text-xs text-gray-500 font-normal mt-1">{event.time}</div>
                    </div>
                    
                    <div className={`absolute left-24 -ml-[2px] w-9 h-[3px] mt-5 ${isActive ? "bg-primary" : "bg-border"}`} />
                    
                    <div className={`absolute left-24 -ml-[15px] mt-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive 
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                        : "bg-surface border-border text-gray-500 group-hover:border-primary/50"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={`flex-1 min-h-[190px] p-7 rounded-2xl transition-all ${
                    isActive 
                      ? "bg-[#13233d] ring-1 ring-primary/70 shadow-[0_18px_45px_-22px_rgba(59,130,246,0.85)]" 
                      : "bg-surface/70 shadow-[0_12px_30px_-25px_rgba(0,0,0,0.8)] group-hover:bg-surface"
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`text-xs uppercase font-bold tracking-wide px-2.5 py-1 rounded-full ${
                            event.category === 'Evidence' ? 'bg-accent/20 text-accent' :
                            event.category === 'Arrest' ? 'bg-semantic-danger/20 text-semantic-danger' :
                            'bg-border text-gray-300'
                          }`}>
                            {event.category}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/20 text-gray-200">Officer: {event.officer}</span>
                          {event.evidenceCount ? <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/20 text-gray-200">Evidence: {event.evidenceCount}</span> : null}
                        </div>
                        <h3 className={`font-semibold text-[18px] leading-7 ${isActive ? "text-white" : "text-gray-100"}`}>
                          {event.title}
                        </h3>
                      </div>
                      
                    </div>
                    
                    <p className={`text-[15px] leading-7 line-clamp-3 ${isActive ? "text-gray-200" : "text-gray-400"}`}>
                      {event.summary}
                    </p>

                    {isActive && (
                      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                        {event.connectedEntities?.map((ent, idx) => (
                          <span key={idx} className="text-xs font-semibold px-2 py-1 bg-card rounded-lg text-gray-300 border border-border">
                            {ent}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="h-32" /> {/* Bottom padding */}
        </div>
      </div>
    </div>
  );
};
