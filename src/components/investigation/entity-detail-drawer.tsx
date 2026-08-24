"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { useInvestigation } from "@/providers/investigation-provider";
import {
  AlertOctagon, Users, FolderOpen, FileText, Network as NetworkIcon, Bot,
  ArrowRight, Landmark, Phone, Car, UserCog, ShieldCheck, ArrowRightLeft, Clock,
} from "lucide-react";

export type DrawerView = "threat" | "suspects" | "evidence" | "related" | "network" | null;

const VIEW_TITLE: Record<Exclude<DrawerView, null>, string> = {
  threat: "Threat Assessment",
  suspects: "Known Suspects",
  evidence: "Evidence Inventory",
  related: "Related Cases",
  network: "Linked Entities",
};

const riskBand = (n: number) =>
  n >= 80 ? { label: "Critical", text: "text-semantic-danger", bar: "bg-semantic-danger" }
  : n >= 60 ? { label: "High", text: "text-orange-400", bar: "bg-orange-400" }
  : n >= 40 ? { label: "Medium", text: "text-semantic-warning", bar: "bg-semantic-warning" }
  : { label: "Low", text: "text-semantic-success", bar: "bg-semantic-success" };

const initials = (name: string) => name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

const Avatar: React.FC<{ name: string; tone: string }> = ({ name, tone }) => (
  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${tone}`}>{initials(name)}</div>
);

export const EntityDetailDrawer: React.FC<{ view: DrawerView; onClose: () => void }> = ({ view, onClose }) => {
  const router = useRouter();
  const { caseContext, setInvestigation } = useInvestigation();

  const related = useMemo(() => {
    if (!caseContext) return [];
    const { fir, relatedFirs } = caseContext;
    return relatedFirs
      .map(item => {
        const mo = item.category === fir.category;
        const loc = item.district === fir.district;
        const shared = item.linkedSuspects.filter(id => fir.linkedSuspects.includes(id));
        const score = Number(mo) + Number(loc) + shared.length * 2;
        const match = Math.min(99, 55 + score * 11);
        return { item, mo, loc, shared, score, match };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [caseContext]);

  if (!caseContext) return null;
  const { fir, suspects, evidence, accounts, phones, victims, vehicles, timeline } = caseContext;

  const go = (path: string) => { onClose(); router.push(path); };

  // ---- Threat breakdown -------------------------------------------------
  const highRisk = suspects.filter(s => s.riskScore >= 80);
  const unfrozen = accounts.filter(a => a.status !== "Frozen");
  const factors = [
    { label: `${highRisk.length} suspect(s) at 80+ risk`, weight: highRisk.length ? "+High" : "Low", up: highRisk.length > 0 },
    { label: `${unfrozen.length} of ${accounts.length} account(s) still liquid`, weight: unfrozen.length ? "+Med" : "Low", up: unfrozen.length > 0 },
    { label: `${evidence.length} evidence item(s) corroborating`, weight: evidence.length >= 3 ? "Stabilising" : "Thin", up: false },
    { label: `${related.length} linked FIR(s) by MO/area/people`, weight: related.length ? "+Med" : "Low", up: related.length > 0 },
  ];
  const band = riskBand(fir.riskScore);

  return (
    <Drawer isOpen={view !== null} onClose={onClose} title={view ? VIEW_TITLE[view] : ""} size="xl">
      {view === "threat" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/70 bg-surface/60 p-5 text-center">
            <div className={`text-5xl font-bold tabular-nums ${band.text}`}>{fir.riskScore}<span className="text-2xl text-gray-500">/100</span></div>
            <div className={`mt-1 text-sm font-bold uppercase tracking-wider ${band.text}`}>{band.label} priority</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/40"><div className={`h-full ${band.bar}`} style={{ width: `${fir.riskScore}%` }} /></div>
          </div>
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">What drives the score</h4>
            <div className="space-y-1.5">
              {factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/20 px-3 py-2 text-sm">
                  <span className="text-gray-300">{f.label}</span>
                  <span className={`shrink-0 text-xs font-bold ${f.up ? "text-semantic-danger" : "text-gray-500"}`}>{f.weight}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">AI reasoning</div>
            <p className="text-sm leading-relaxed text-gray-300">The {fir.riskScore}/100 rating weights recorded FIR severity against high-risk linked suspects, open financial exfiltration paths, and corroboration depth. It is a triage signal for sequencing work — not a determination of guilt.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Recommended actions</h4>
            <button onClick={() => go("/network")} className="flex w-full items-center justify-between rounded-lg bg-card px-4 py-2.5 text-sm font-semibold text-gray-200 hover:bg-card-hover"><span>Verify high-risk suspects in the network</span><ArrowRight className="h-4 w-4 text-gray-500" /></button>
            <button onClick={() => go("/copilot")} className="flex w-full items-center justify-between rounded-lg bg-card px-4 py-2.5 text-sm font-semibold text-gray-200 hover:bg-card-hover"><span className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Ask the Copilot to assess risk</span><ArrowRight className="h-4 w-4 text-gray-500" /></button>
          </div>
        </div>
      )}

      {view === "suspects" && (
        <div className="space-y-3">
          {suspects.length === 0 && <p className="text-sm text-gray-400">No suspects are linked to this FIR.</p>}
          {[...suspects].sort((a, b) => b.riskScore - a.riskScore).map(s => {
            const b = riskBand(s.riskScore);
            return (
              <div key={s.id} className="rounded-xl border border-border/60 bg-card/20 p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={s.name} tone={`${b.text} border-current/30 bg-current/10`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-white">{s.name}{s.alias ? <span className="text-gray-500 font-normal"> · “{s.alias}”</span> : null}</div>
                      <span className={`shrink-0 text-xs font-bold ${b.text}`}>{s.riskScore}/100</span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">{s.type} · <span className={s.status === "Absconding" ? "text-semantic-danger font-semibold" : ""}>{s.status}</span> · {s.linkedFIRs.length} prior FIR(s)</div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/40"><div className={`h-full ${b.bar}`} style={{ width: `${s.riskScore}%` }} /></div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => go("/network")} className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:bg-card-hover"><NetworkIcon className="h-3.5 w-3.5 text-semantic-warning" /> Network</button>
                      <button onClick={() => go("/copilot")} className="flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:bg-card-hover"><Bot className="h-3.5 w-3.5 text-primary" /> Copilot</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "evidence" && (
        <div className="space-y-2">
          {evidence.length === 0 && <p className="text-sm text-gray-400">No evidence catalogued for this FIR.</p>}
          {evidence.map(e => {
            const linkedStep = timeline.find(t => t.category === "Evidence") || timeline.find(t => e.type && t.title.toLowerCase().includes("evidence"));
            return (
              <div key={e.id} className="rounded-xl border border-border/60 bg-card/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"><FolderOpen className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white">{e.title}</div>
                    <div className="font-mono text-[10px] text-gray-500">{e.id}</div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>Type: <span className="text-gray-200">{e.type}</span></span>
                      <span>Size: <span className="text-gray-200 tabular-nums">{e.fileSize}</span></span>
                      <span>Recovered: <span className="text-gray-200 tabular-nums">{e.date}</span></span>
                      <span>Status: <span className="text-semantic-success">Secured</span></span>
                    </div>
                    {linkedStep && <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500"><Clock className="h-3 w-3" /> Timeline: {linkedStep.title}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "related" && (
        <div className="space-y-3">
          {related.length === 0 && <p className="text-sm text-gray-400">No related FIRs cleared the MO / district / shared-suspect threshold.</p>}
          {related.map(({ item, mo, loc, shared, match }) => (
            <div key={item.id} className="rounded-xl border border-border/60 bg-card/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-white">{item.firNumber}</div>
                <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary tabular-nums">{match}% match</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">{item.category} · {item.district} · {item.status}</div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                {mo && <span className="rounded bg-black/30 px-2 py-0.5 text-gray-300">Same MO</span>}
                {loc && <span className="rounded bg-black/30 px-2 py-0.5 text-gray-300">Same district</span>}
                {shared.length > 0 && <span className="rounded bg-black/30 px-2 py-0.5 text-gray-300">{shared.length} shared suspect(s)</span>}
              </div>
              <button
                onClick={() => { setInvestigation("FIR", item.category, item.firNumber); onClose(); }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-primary-hover"
              >
                <ArrowRightLeft className="h-4 w-4" /> Switch Investigation
              </button>
            </div>
          ))}
        </div>
      )}

      {view === "network" && (
        <div className="space-y-4">
          {([
            { label: "Suspects", icon: Users, items: suspects.map(s => s.name), tone: "text-semantic-danger" },
            { label: "Victims", icon: UserCog, items: victims.map(v => v.name), tone: "text-pink-400" },
            { label: "Phone lines", icon: Phone, items: phones.map(p => p.phoneNumber), tone: "text-orange-300" },
            { label: "Bank accounts", icon: Landmark, items: accounts.map(a => `${a.bankName} ••${a.accountNumber.slice(-4)}`), tone: "text-violet-300" },
            { label: "Vehicles", icon: Car, items: (vehicles || []).map(v => v.plateNumber), tone: "text-semantic-success" },
          ] as const).filter(g => g.items.length > 0).map(group => (
            <div key={group.label}>
              <h4 className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <group.icon className={`h-3.5 w-3.5 ${group.tone}`} /> {group.label} <span className="text-gray-600">· {group.items.length}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((name, i) => <span key={i} className="rounded-lg border border-border/60 bg-card/30 px-2.5 py-1 text-xs text-gray-200">{name}</span>)}
              </div>
            </div>
          ))}
          <button onClick={() => go("/network")} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"><NetworkIcon className="h-4 w-4" /> Open full network graph</button>
        </div>
      )}
    </Drawer>
  );
};
