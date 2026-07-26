"use client";

import React, { useState } from "react";
import { Clock, Play, Pause } from "lucide-react";

export const TimeSlider: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Today", "Last Week", "Last Month", "Last Year"];

  return (
    <div className="flex-1 bg-surface/80 border border-border/80 rounded-xl px-4 py-2 flex items-center gap-6">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 bg-primary/20 hover:bg-primary/40 border border-primary/40 rounded-xl text-primary transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>

      <div className="flex-1 relative h-10 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-1 bg-border rounded-full" />
        
        {/* Active Track */}
        <div 
          className="absolute left-0 h-1 bg-primary rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="absolute inset-0 flex justify-between">
          {steps.map((step, idx) => (
            <div 
              key={step}
              onClick={() => setActiveStep(idx)}
              className="flex flex-col items-center justify-center cursor-pointer group"
              style={{ width: "24px" }}
            >
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                idx <= activeStep ? "bg-primary border-primary" : "bg-surface border-border group-hover:border-primary/50"
              }`} />
              <span className={`absolute -bottom-5 text-[10px] font-bold whitespace-nowrap transition-colors ${
                idx === activeStep ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
