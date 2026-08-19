"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, CheckCircle2, Search, FileText, ArrowRight, CornerDownRight,
  Paperclip, Clock, User, Landmark, Phone, Car, Network as NetworkIcon, FileWarning,
} from "lucide-react";
import { AIResponseData, Citation, CitationKind } from "@/lib/copilot-engine";
import { addCaseTask, getCaseTasks } from "@/lib/case-tasks";
import { useInvestigation } from "@/providers/investigation-provider";

interface ResponseFormatterProps {
  data: AIResponseData;
  onFollowUp?: (text: string) => void;
}

const CITATION_META: Record<CitationKind, { icon: React.ElementType; tint: string }> = {
  evidence: { icon: Paperclip, tint: "text-accent" },
  timeline: { icon: Clock, tint: "text-primary" },
  suspect: { icon: User, tint: "text-semantic-danger" },
  account: { icon: Landmark, tint: "text-[#c4b5fd]" },
  phone: { icon: Phone, tint: "text-[#fdba74]" },
  vehicle: { icon: Car, tint: "text-semantic-success" },
  victim: { icon: User, tint: "text-[#f9a8d4]" },
  fir: { icon: FileText, tint: "text-primary" },
  network: { icon: NetworkIcon, tint: "text-semantic-warning" },
};

const confidenceTone = (n: number) =>
  n >= 80 ? { text: "text-semantic-success", bar: "bg-semantic-success", label: "High" }
  : n >= 60 ? { text: "text-semantic-warning", bar: "bg-semantic-warning", label: "Moderate" }
  : { text: "text-semantic-danger", bar: "bg-semantic-danger", label: "Guarded" };

const CitationChip: React.FC<{ c: Citation }> = ({ c }) => {
  const meta = CITATION_META[c.kind] || CITATION_META.evidence;
  const Icon = meta.icon;
  return (
    <div
      title={c.detail ? `${c.label} — ${c.detail}` : c.label}
      className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border/80 rounded-lg text-[11px] font-medium text-gray-300 max-w-full"
    >
      <Icon className={`w-3 h-3 shrink-0 ${meta.tint}`} />
      <span className="truncate">{c.label}</span>
    </div>
  );
};

export const ResponseFormatter: React.FC<ResponseFormatterProps> = ({ data, onFollowUp }) => {
  const router = useRouter();
  const { activeFir } = useInvestigation();
  const [assigned, setAssigned] = useState<Set<number>>(new Set());
  const tone = confidenceTone(data.confidence.score);

  // Reflect tasks already in the store (e.g. after the conversation is restored).
  useEffect(() => {
    if (!activeFir) return;
    const existing = new Set(getCaseTasks(activeFir.firNumber).map(t => t.label));
    const marked = new Set<number>();
    data.nextActions.forEach((a, i) => { if (existing.has(a.label)) marked.add(i); });
    if (marked.size) setAssigned(prev => new Set([...prev, ...marked]));
  }, [activeFir, data.nextActions]);

  const assignTask = (idx: number, label: string) => {
    if (activeFir) addCaseTask(activeFir.firNumber, label, "Copilot");
    setAssigned(prev => new Set(prev).add(idx));
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">
      {/* Summary */}
      <div className="leading-relaxed text-gray-100 text-[15px]">{data.summary}</div>

      {/* Key Findings */}
      {data.keyFindings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-primary" /> Key Findings
          </h4>
          <ul className="space-y-1.5">
            {data.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex gap-2.5 leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations — real records this answer is grounded in */}
      {data.citations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Paperclip className="w-3.5 h-3.5 text-accent" /> Sources Cited
            <span className="text-gray-600 normal-case tracking-normal font-normal">· {data.citations.length} record(s) from this case file</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.citations.map((c, idx) => <CitationChip key={idx} c={c} />)}
          </div>
        </div>
      )}

      {/* Reasoning + explained confidence */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,220px] gap-3">
        <div className="p-4 bg-surface/60 border border-border/70 rounded-xl space-y-2">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">How I reached this</div>
          <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-primary/50 pl-3">{data.reasoning}</p>
        </div>

        <div className="p-4 bg-surface/60 border border-border/70 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Confidence</span>
            <span className={`flex items-center gap-1 font-bold text-lg ${tone.text}`}>
              <ShieldCheck className="w-4 h-4" /> {data.confidence.score}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
            <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${data.confidence.score}%` }} />
          </div>
          <div className="space-y-1 pt-0.5">
            {data.confidence.factors.slice(0, 4).map((f, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-gray-400 truncate">{f.label}</span>
                <span className={`shrink-0 font-semibold tabular-nums ${f.delta >= 0 ? "text-semantic-success" : "text-semantic-danger"}`}>
                  {f.delta >= 0 ? "+" : ""}{f.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next actions — deep-link where useful, otherwise assignable */}
      {data.nextActions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-semantic-warning" /> Recommended Next Actions
          </h4>
          <div className="flex flex-col gap-2">
            {data.nextActions.map((action, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-semantic-warning/[0.07] border border-semantic-warning/20 rounded-xl">
                <span className="font-medium text-gray-100 text-[13px]">{action.label}</span>
                {action.route ? (
                  <button
                    onClick={() => router.push(action.route!)}
                    className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-gray-200 hover:text-white transition-colors"
                  >
                    Open <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => assignTask(idx, action.label)}
                    disabled={assigned.has(idx)}
                    title={assigned.has(idx) ? "Added to Case Tasks — view on the Dashboard" : "Assign to the case task list"}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      assigned.has(idx)
                        ? "bg-semantic-success/15 text-semantic-success border border-semantic-success/30 cursor-default"
                        : "bg-semantic-warning hover:bg-semantic-warning/80 text-black"
                    }`}
                  >
                    {assigned.has(idx) ? "Added to Case Tasks ✓" : "Assign Task"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic follow-up suggestions — keep the conversation moving */}
      {data.followUps.length > 0 && onFollowUp && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ask a follow-up</h4>
          <div className="flex flex-wrap gap-2">
            {data.followUps.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUp(q)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card/70 hover:bg-primary/10 border border-border hover:border-primary/50 rounded-full text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                <CornerDownRight className="w-3 h-3 text-primary" /> {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deep links */}
      <div className="pt-4 border-t border-border/50 flex flex-wrap items-center gap-2">
        {data.links.includes("Network") && (
          <button onClick={() => router.push("/network")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-gray-300 transition-colors">
            Explore Network <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
        {data.links.includes("Timeline") && (
          <button onClick={() => router.push("/timeline")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-gray-300 transition-colors">
            View Timeline <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
        {data.links.includes("Dashboard") && (
          <button onClick={() => router.push("/")} className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-card-hover border border-border rounded-lg text-xs font-semibold text-gray-300 transition-colors">
            Command Dashboard <ArrowRight className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};
