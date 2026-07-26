"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, ShieldCheck, CheckCircle2, AlertTriangle, 
  Search, FileText, ArrowRight, Activity, Paperclip 
} from "lucide-react";

export interface AIResponseData {
  summary: string;
  keyFindings: string[];
  evidenceUsed: string[];
  reasoning: string;
  confidenceScore: number;
  nextActions: string[];
  links: string[];
}

interface ResponseFormatterProps {
  data: AIResponseData;
}

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="space-y-6 text-sm text-gray-300">
      
      {/* Summary */}
      <div className="leading-relaxed text-gray-200 text-base">
        {data.summary}
      </div>

      {/* Key Findings */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" /> Key Findings
        </h4>
        <ul className="space-y-2 pl-6 list-disc marker:text-primary">
          {data.keyFindings.map((finding, idx) => (
            <li key={idx}>{finding}</li>
          ))}
        </ul>
      </div>

      {/* Evidence Used */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-accent" /> Evidence Analyzed
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.evidenceUsed.map((ev, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-card border border-border/80 rounded-lg text-xs font-medium text-gray-300">
              <FileText className="w-3 h-3 text-gray-400" /> {ev}
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning & Confidence */}
      <div className="flex gap-4">
        <div className="flex-1 p-4 bg-surface/50 border border-border/80 rounded-xl space-y-2">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">AI Reasoning</div>
          <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-primary/50 pl-3">
            {data.reasoning}
          </p>
        </div>
        
        <div className="w-32 shrink-0 p-4 bg-surface/50 border border-border/80 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Confidence</div>
          <div className="flex items-center gap-1.5 text-semantic-success font-bold text-xl">
            <ShieldCheck className="w-5 h-5" /> {data.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-semantic-warning" /> Recommended Next Actions
        </h4>
        <div className="flex flex-col gap-2">
          {data.nextActions.map((action, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-semantic-warning/10 border border-semantic-warning/20 rounded-xl">
              <span className="font-semibold text-white">{action}</span>
              <button className="px-4 py-1.5 bg-semantic-warning hover:bg-semantic-warning/80 text-black text-xs font-bold rounded-lg transition-colors">
                Assign Task
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Links */}
      <div className="pt-4 border-t border-border/50 flex items-center gap-3">
        {data.links.includes("Network") && (
          <button onClick={() => router.push("/network")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-bold text-gray-300 transition-colors">
            Explore Network <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
        {data.links.includes("Timeline") && (
          <button onClick={() => router.push("/timeline")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-bold text-gray-300 transition-colors">
            View Timeline <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
        {data.links.includes("Dashboard") && (
          <button onClick={() => router.push("/")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-bold text-gray-300 transition-colors">
            Command Dashboard <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>

    </div>
  );
};
