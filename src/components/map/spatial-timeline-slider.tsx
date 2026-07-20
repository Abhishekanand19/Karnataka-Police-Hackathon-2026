"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SpatialTimelineSliderProps {
  onTimeChange?: (timeStep: string) => void;
}

const timeSteps = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "2026", label: "YTD 2026" },
];

export const SpatialTimelineSlider: React.FC<SpatialTimelineSliderProps> = ({ onTimeChange }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(2); // default 30d
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => {
          const next = (prev + 1) % timeSteps.length;
          if (onTimeChange) onTimeChange(timeSteps[next].id);
          return next;
        });
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, onTimeChange]);

  const handleStepSelect = (index: number) => {
    setActiveStepIndex(index);
    if (onTimeChange) onTimeChange(timeSteps[index].id);
  };

  return (
    <div className="p-3 bg-card/90 border border-card-border rounded-xl shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 select-none">
      {/* Playback Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleStepSelect(Math.max(0, activeStepIndex - 1))}
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
          onClick={() => handleStepSelect(Math.min(timeSteps.length - 1, activeStepIndex + 1))}
          icon={<SkipForward className="w-3.5 h-3.5" />}
        />
      </div>

      {/* Time Steps Bar */}
      <div className="flex-1 w-full space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent" /> Spatial Timeline:
          </span>
          <span className="text-white font-bold">{timeSteps[activeStepIndex].label}</span>
        </div>

        {/* Steps Track */}
        <div className="relative flex items-center justify-between gap-1 bg-surface p-1 rounded-lg border border-border">
          {timeSteps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => handleStepSelect(idx)}
                className={`flex-1 py-1 text-[11px] font-medium rounded transition-all text-center ${
                  isActive
                    ? "bg-primary text-white font-bold shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-card/50"
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
