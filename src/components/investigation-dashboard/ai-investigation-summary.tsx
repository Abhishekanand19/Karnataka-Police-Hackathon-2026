"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { Bot, AlertTriangle, ShieldCheck, FileText, ArrowRight, Activity, GitFork } from "lucide-react";

export const AIInvestigationSummary: React.FC = () => {
  const router = useRouter();
  const { caseContext } = useInvestigation();
  const fir = caseContext?.fir;

  if (!fir) return null;

  const threatLevel = fir.riskScore > 85 ? "Critical" : fir.riskScore > 70 ? "High" : "Medium";
  const confidenceScore = Math.min(99, fir.riskScore + 5);

  const aiFindings = [
    `${caseContext?.relatedFirs.length || 0} related FIR(s) share location, modus operandi, or suspect signals.`,
    `${caseContext?.suspects.length || 0} named suspect(s) are linked to this FIR.`,
    `${caseContext?.accounts.length || 0} financial account(s) and ${caseContext?.phones.length || 0} phone record(s) are available for corroboration.`
  ];

  return (
    <div className="bg-surface border border-border/80 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full group">
      {/* Background glow based on risk */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors ${
        threatLevel === "Critical" ? "bg-semantic-danger" : threatLevel === "High" ? "bg-semantic-warning" : "bg-primary"
      }`} />

      <div className="relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
            <Bot className="w-5 h-5" /> AI Case Summary
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
            threatLevel === "Critical" ? "bg-semantic-danger/10 text-semantic-danger border-semantic-danger/30" :
            threatLevel === "High" ? "bg-semantic-warning/10 text-semantic-warning border-semantic-warning/30" :
            "bg-primary/10 text-primary border-primary/30"
          }`}>
            Threat: {threatLevel}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">{fir.category}</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {fir.description}
          </p>
        </div>

        <div className="space-y-3 p-4 bg-[#0a0c14]/50 border border-border/50 rounded-xl">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key AI Findings</div>
          {aiFindings.map((finding, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
              <div className="mt-0.5 p-1 bg-primary/20 rounded-md text-primary shrink-0">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <span>{finding}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">AI Confidence Score</span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-semantic-success" />
            <span className="text-lg font-bold text-white">{confidenceScore}%</span>
          </div>
        </div>
        <button 
          onClick={() => router.push("/copilot")}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          Open AI Analysis <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
