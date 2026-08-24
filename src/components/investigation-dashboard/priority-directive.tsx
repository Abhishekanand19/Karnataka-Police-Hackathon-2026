"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { AlertOctagon, ArrowRight, Landmark, UserX, FileWarning, Gavel, Bot } from "lucide-react";

type Severity = "critical" | "warning" | "info";

interface Directive {
  severity: Severity;
  icon: React.ElementType;
  label: string;
  detail: string;
  route: string;
  cta: string;
}

const SEV: Record<Severity, { ring: string; chip: string; bar: string; text: string; word: string }> = {
  critical: { ring: "border-semantic-danger/40", chip: "bg-semantic-danger/15 text-semantic-danger border-semantic-danger/30", bar: "bg-semantic-danger", text: "text-semantic-danger", word: "Critical" },
  warning: { ring: "border-semantic-warning/40", chip: "bg-semantic-warning/15 text-semantic-warning border-semantic-warning/30", bar: "bg-semantic-warning", text: "text-semantic-warning", word: "Elevated" },
  info: { ring: "border-primary/40", chip: "bg-primary/15 text-primary border-primary/30", bar: "bg-primary", text: "text-primary", word: "Routine" },
};

export const PriorityDirective: React.FC = () => {
  const router = useRouter();
  const { caseContext } = useInvestigation();

  const { directives, riskFactor } = useMemo(() => {
    if (!caseContext) return { directives: [] as Directive[], riskFactor: "" };
    const { fir, suspects, accounts, evidence, timeline } = caseContext;
    const out: Directive[] = [];

    const absconding = suspects.filter(s => s.status === "Absconding");
    if (absconding.length) out.push({
      severity: "critical", icon: UserX,
      label: `Issue a lookout circular on ${absconding.length} absconding suspect${absconding.length > 1 ? "s" : ""}`,
      detail: absconding.map(s => s.name).join(", "), route: "/network", cta: "Open network",
    });

    const liquid = accounts.filter(a => a.status !== "Frozen");
    if (liquid.length) out.push({
      severity: absconding.length ? "warning" : "critical", icon: Landmark,
      label: `Freeze ${liquid.length} still-liquid account${liquid.length > 1 ? "s" : ""} before funds disperse`,
      detail: liquid.slice(0, 3).map(a => `${a.bankName} ••${a.accountNumber.slice(-4)}`).join(", "), route: "/reports", cta: "Draft freeze order",
    });

    if (evidence.length < 3) out.push({
      severity: "warning", icon: FileWarning,
      label: "Close the evidence gap — fewer than three exhibits catalogued",
      detail: `${evidence.length} exhibit(s) on file`, route: "/reports", cta: "Review evidence",
    });

    const last = timeline.at(-1);
    out.push({
      severity: "info", icon: Gavel,
      label: `Confirm the next procedural step after "${last?.title || "registration"}"`,
      detail: `Case is ${fir.status}`, route: "/timeline", cta: "Open timeline",
    });

    const topSuspect = [...suspects].sort((a, b) => b.riskScore - a.riskScore)[0];
    const riskFactor = topSuspect
      ? `Primary driver: ${topSuspect.name} (${topSuspect.type}, risk ${topSuspect.riskScore}/100${topSuspect.status === "Absconding" ? ", absconding" : ""}).`
      : `Priority score ${fir.riskScore}/100 with no elevated suspect yet.`;

    return { directives: out.slice(0, 3), riskFactor };
  }, [caseContext]);

  if (!caseContext || directives.length === 0) return null;

  const lead = directives[0];
  const sev = SEV[lead.severity];
  const LeadIcon = lead.icon;

  return (
    <div className={`surface-panel border ${sev.ring} overflow-hidden`}>
      <div className="flex flex-col lg:flex-row">
        {/* Lead directive — the single most important next move */}
        <div className="relative flex-1 p-5 lg:p-6">
          <div className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${sev.bar}`} />
          <div className="pl-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${sev.chip}`}>
                <AlertOctagon className="w-3 h-3" /> Priority Directive · {sev.word}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 p-2 rounded-xl border shrink-0 ${sev.chip}`}><LeadIcon className="w-5 h-5" /></div>
              <div className="min-w-0">
                <h2 className="text-lg lg:text-xl font-bold text-white leading-snug">{lead.label}</h2>
                <p className="text-sm text-gray-400 mt-1">{lead.detail}</p>
                <p className="text-xs text-gray-500 mt-2">{riskFactor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pl-0">
              <button onClick={() => router.push(lead.route)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white ${sev.bar} hover:brightness-110 transition-all`}>
                {lead.cta} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.push("/copilot")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-200 bg-card hover:bg-card-hover border border-border transition-colors">
                <Bot className="w-4 h-4 text-primary" /> Ask Copilot
              </button>
            </div>
          </div>
        </div>

        {/* Secondary queued actions */}
        {directives.length > 1 && (
          <div className="lg:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/60 bg-black/15 p-4 lg:p-5">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Then</div>
            <div className="space-y-2">
              {directives.slice(1).map((d, idx) => {
                const s = SEV[d.severity];
                const Icon = d.icon;
                return (
                  <button key={idx} onClick={() => router.push(d.route)} className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-card/50 border border-transparent hover:border-border/60 transition-colors group">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${s.text}`} />
                    <span className="flex-1 text-xs font-medium text-gray-300 leading-snug group-hover:text-white">{d.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-300 shrink-0 mt-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
