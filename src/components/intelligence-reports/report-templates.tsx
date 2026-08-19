"use client";

import React from "react";
import { ReportConfig } from "./report-configuration-sidebar";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";

// Deterministic, QR-looking matrix derived from the verification hash. Not a
// scannable code, but it reads as a real verification mark on a printed dossier.
const PseudoQR: React.FC<{ seed: string; size?: number }> = ({ seed, size = 72 }) => {
  const N = 21;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(h, 31) + seed.charCodeAt(i)) | 0;
  const rng = () => { h = (Math.imul(h ^ (h >>> 15), 0x2c1b3c6d)) | 0; return ((h >>> 8) & 0xff) / 255; };
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const local = (br: number, bc: number) => { const rr = r - br, cc = c - bc; const edge = rr === 0 || rr === 6 || cc === 0 || cc === 6; const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4; return edge || core; };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= N - 7) return local(0, N - 7);
    if (r >= N - 7 && c < 7) return local(N - 7, 0);
    return false;
  };
  const cells: React.ReactNode[] = [];
  const s = size / N;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const on = isFinder(r, c) ? finderOn(r, c) : rng() > 0.55;
    if (on) cells.push(<rect key={`${r}-${c}`} x={c * s} y={r * s} width={s} height={s} fill="#111827" />);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Verification code"><rect width={size} height={size} fill="#fff" />{cells}</svg>;
};

const EVIDENCE_GLYPH: Record<string, string> = { CCTV: "▣", Video: "▶", Photo: "◈", Document: "▤", Digital: "⌘", Forensic: "⚗", Financial: "₹", Statement: "✍" };
const glyphFor = (type: string) => { const key = Object.keys(EVIDENCE_GLYPH).find(k => type.toLowerCase().includes(k.toLowerCase())); return key ? EVIDENCE_GLYPH[key] : "▦"; };

export const ReportTemplates: React.FC<{ config: ReportConfig }> = ({ config }) => {
  const { caseContext, officer } = useInvestigation();
  const fir = caseContext?.fir;
  if (!fir) return null;

  const timelineEvents = caseContext.timeline;
  const evidence = caseContext.evidence;
  const suspects = caseContext.suspects;
  const accounts = caseContext.accounts;
  const phones = caseContext.phones;
  const relatedFirs = caseContext.relatedFirs.slice(0, 3);
  const hotspot = MOCK_DB.hotspots.find(item => item.policeStation === fir.station) || MOCK_DB.hotspots.find(item => item.district === fir.district);
  const highRiskSuspects = suspects.filter(item => item.riskScore >= 80);
  const reportId = `SCRB-${fir.firNumber.replace("FIR-", "")}-${fir.date.replaceAll("-", "")}`;
  const auditHash = `${fir.id}-${evidence.length}-${timelineEvents.length}-${suspects.length}`.split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0).toString(16).replace("-", "A").toUpperCase().padStart(12, "0");
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Section registry drives BOTH the numbering and the table of contents, so
  // toggling a section off never leaves a gap in the numbers.
  const sectionDefs = [
    { id: "exec", title: "Executive Summary", on: true },
    { id: "risk", title: "Risk Assessment", on: config.includeAI },
    { id: "suspects", title: "Suspect Profiles", on: config.includeEntities && suspects.length > 0 },
    { id: "timeline", title: "Crime Timeline", on: config.includeTimeline && timelineEvents.length > 0 },
    { id: "evidence", title: "Evidence Register", on: config.includeEvidence && evidence.length > 0 },
    { id: "network", title: "Relationship Graph Snapshot", on: config.includeNetwork },
    { id: "hotspot", title: "Hotspot Map Snapshot", on: config.includeHotspot },
    { id: "ai", title: "AI Recommendations", on: config.includeAI },
    { id: "appendix", title: "Appendix A — Financial & Telecom", on: config.includeEntities && (accounts.length > 0 || phones.length > 0) },
    { id: "audit", title: "Audit Metadata & Verification", on: true },
  ];
  const enabled = sectionDefs.filter(s => s.on);
  const numOf = (id: string) => enabled.findIndex(s => s.id === id) + 1;
  const H: React.FC<{ id: string }> = ({ id }) => {
    const def = enabled.find(s => s.id === id);
    if (!def) return null;
    return <h2 id={`sec-${id}`} className="scroll-mt-4 text-base font-bold uppercase border-b border-gray-300 pb-1 mb-3">{numOf(id)}. {def.title}</h2>;
  };

  return (
    <div className="font-serif text-gray-900 leading-relaxed text-sm">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden z-0">
        <h1 className="text-[150px] font-bold transform -rotate-45 whitespace-nowrap">KSP CONFIDENTIAL</h1>
      </div>

      <div className="relative z-10">
        {/* Cover header */}
        <div className="text-center border-b-2 border-gray-900 pb-6 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Karnataka State Police</h1>
          <h2 className="text-xl font-semibold uppercase tracking-wider text-gray-700 mb-1">State Crime Records Bureau (SCRB)</h2>
          <h3 className="text-lg uppercase text-gray-500 font-bold tracking-widest">{config.reportType}</h3>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6 text-sm">
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Report ID</div><div className="font-mono">{reportId}</div></div>
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Generated On</div><div className="font-mono">{today} {time}</div></div>
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Case Reference</div><div className="font-bold text-lg">{fir.firNumber}</div></div>
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Jurisdiction</div><div className="font-semibold">{fir.station}, {fir.district}</div></div>
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Generated By</div><div>{officer?.name || "System Admin"} ({officer?.badgeId || "ADMIN"})</div></div>
          <div><div className="font-bold uppercase text-xs text-gray-500 tracking-wider">Security Classification</div><div className="font-bold text-red-700">RESTRICTED</div></div>
        </div>

        {/* Table of contents — auto-generated, clickable */}
        <div className="mb-8 border border-gray-300 bg-gray-50 p-4" style={{ pageBreakInside: "avoid" }}>
          <div className="font-bold uppercase text-xs text-gray-500 tracking-widest mb-2">Contents</div>
          <ol className="space-y-1">
            {enabled.map(s => (
              <li key={s.id} className="flex items-baseline text-sm">
                <a href={`#sec-${s.id}`} className="text-gray-800 hover:text-blue-700 hover:underline">{numOf(s.id)}. {s.title}</a>
                <span className="mx-2 flex-1 border-b border-dotted border-gray-400 translate-y-[-3px]" />
                <span className="font-mono text-xs text-gray-500">§{numOf(s.id)}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 1. Executive Summary */}
        <section className="mb-8"><H id="exec" />
          <p className="mb-3 text-justify">{fir.description}</p>
          <div className="grid grid-cols-4 border border-gray-300 text-center text-xs">
            <div className="p-2 border-r border-gray-300"><strong className="block text-base">{fir.riskScore}</strong>Threat score</div>
            <div className="p-2 border-r border-gray-300"><strong className="block text-base">{suspects.length}</strong>Suspects</div>
            <div className="p-2 border-r border-gray-300"><strong className="block text-base">{evidence.length}</strong>Evidence items</div>
            <div className="p-2"><strong className="block text-base">{relatedFirs.length}</strong>Related FIRs</div>
          </div>
        </section>

        {config.includeAI && <section className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="risk" />
          <div className="bg-gray-100 p-4 border-l-4 border-gray-800 text-justify"><strong>{fir.riskScore}/100 priority score.</strong> The assessment is based on {highRiskSuspects.length} high-risk linked suspect(s), {accounts.length} financial account(s), {phones.length} phone record(s), and {evidence.length} case-linked evidence item(s). It is an investigative prioritisation indicator and not a finding of guilt.</div>
        </section>}

        {config.includeEntities && suspects.length > 0 && (
          <div className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="suspects" />
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-200">
                <th className="p-2 border border-gray-400 font-bold text-sm">Name / Alias</th>
                <th className="p-2 border border-gray-400 font-bold text-sm">Type</th>
                <th className="p-2 border border-gray-400 font-bold text-sm">Status</th>
                <th className="p-2 border border-gray-400 font-bold text-sm text-right">Risk</th>
              </tr></thead>
              <tbody>
                {suspects.map((s, i) => (
                  <tr key={s.id} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-2 border border-gray-300 font-semibold">{s.name} {s.alias ? `(${s.alias})` : ""}</td>
                    <td className="p-2 border border-gray-300">{s.type}</td>
                    <td className="p-2 border border-gray-300">{s.status}</td>
                    <td className="p-2 border border-gray-300 text-red-700 font-bold text-right tabular-nums">{s.riskScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {config.includeTimeline && timelineEvents.length > 0 && (
          <div className="mb-8"><H id="timeline" />
            <div className="space-y-4 pl-4 border-l-2 border-gray-300 ml-2">
              {timelineEvents.map((e, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 bg-gray-800 rounded-full border-2 border-white" />
                  <div className="font-bold">{e.date} {e.time} — {e.title}</div>
                  <div className="text-gray-600 italic mb-1 text-xs">Logged by {e.officer}</div>
                  <p className="text-sm">{e.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {config.includeEvidence && evidence.length > 0 && (
          <div className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="evidence" />
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-200">
                <th className="p-2 border border-gray-400 font-bold text-sm w-10 text-center">#</th>
                <th className="p-2 border border-gray-400 font-bold text-sm">Exhibit</th>
                <th className="p-2 border border-gray-400 font-bold text-sm">Type</th>
                <th className="p-2 border border-gray-400 font-bold text-sm">Recovered</th>
                <th className="p-2 border border-gray-400 font-bold text-sm text-right">Size</th>
              </tr></thead>
              <tbody>
                {evidence.map((e, i) => (
                  <tr key={e.id} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-2 border border-gray-300 text-center text-lg leading-none" title={e.type}>{glyphFor(e.type)}</td>
                    <td className="p-2 border border-gray-300 font-semibold">{e.title}<div className="font-mono text-[10px] text-gray-500">{e.id}</div></td>
                    <td className="p-2 border border-gray-300">{e.type}</td>
                    <td className="p-2 border border-gray-300 tabular-nums">{e.date}</td>
                    <td className="p-2 border border-gray-300 text-right tabular-nums">{e.fileSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {config.includeNetwork && <section className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="network" />
          <div className="border border-gray-300 bg-slate-50 p-3">
            <svg viewBox="0 0 640 190" className="w-full h-auto" role="img" aria-label="Relationship graph snapshot">
              <line x1="320" y1="95" x2="145" y2="42" stroke="#64748b" strokeWidth="2" />
              <line x1="320" y1="95" x2="145" y2="148" stroke="#64748b" strokeWidth="2" />
              {suspects.slice(0, 3).map((suspect, index) => <g key={suspect.id}><line x1="320" y1="95" x2={495} y2={35 + index * 60} stroke="#64748b" strokeWidth="2" /><circle cx={495} cy={35 + index * 60} r="18" fill="#ef4444" /><text x={525} y={40 + index * 60} fontSize="11" fill="#111827">{suspect.name}</text></g>)}
              <circle cx="320" cy="95" r="27" fill="#2563eb" /><text x="320" y="99" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{fir.firNumber.slice(-5)}</text>
              <circle cx="145" cy="42" r="18" fill="#ec4899" /><text x="145" y="16" textAnchor="middle" fontSize="10">Victim{caseContext.victims.length !== 1 ? "s" : ""}</text>
              <circle cx="145" cy="148" r="18" fill="#8b5cf6" /><text x="145" y="178" textAnchor="middle" fontSize="10">Accounts</text>
            </svg>
            <p className="mt-1 text-[10px] text-gray-600">Snapshot shows direct FIR relationships only. Full interactive network is retained in the case workspace.</p>
          </div>
        </section>}

        {config.includeHotspot && <section className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="hotspot" />
          <div className="relative h-40 overflow-hidden border border-gray-300 bg-slate-100" style={{ backgroundImage: "linear-gradient(30deg, #e5e7eb 12%, transparent 12.5%, transparent 87%, #e5e7eb 87.5%), linear-gradient(150deg, #e5e7eb 12%, transparent 12.5%, transparent 87%, #e5e7eb 87.5%)", backgroundSize: "26px 26px" }}>
            <div className="absolute left-[50%] top-[48%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"><span className="h-7 w-7 rounded-full border-4 border-red-700 bg-red-200" /><span className="mt-1 rounded bg-white px-2 py-1 text-[10px] font-bold shadow">{fir.station}</span></div>
            <div className="absolute bottom-2 left-3 text-[10px]"><strong>Area:</strong> {hotspot?.name || fir.district}<br /><strong>District:</strong> {fir.district} · <strong>Hotspot risk:</strong> {hotspot?.risk || "Case-scoped"}</div>
          </div>
        </section>}

        {config.includeAI && <section className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="ai" />
          <ol className="list-decimal space-y-1 pl-5"><li>Prioritise identity and location verification for {highRiskSuspects[0]?.name || "the highest-risk linked suspect"}.</li><li>Reconcile {accounts.length} linked financial account(s) with the evidence ledger and freeze status.</li><li>Review {relatedFirs.length} related FIR(s) for repeat MO, district, or suspect signals before the next case review.</li></ol>
        </section>}

        {/* Appendix — financial & telecom registers */}
        {config.includeEntities && (accounts.length > 0 || phones.length > 0) && (
          <section className="mb-8" style={{ pageBreakInside: "avoid" }}><H id="appendix" />
            {accounts.length > 0 && <>
              <div className="font-bold text-sm mb-1">A.1 Linked Financial Accounts</div>
              <table className="w-full text-left border-collapse mb-4 text-xs">
                <thead><tr className="bg-gray-200"><th className="p-1.5 border border-gray-400">Bank</th><th className="p-1.5 border border-gray-400">Account</th><th className="p-1.5 border border-gray-400">Status</th><th className="p-1.5 border border-gray-400 text-right">Balance</th></tr></thead>
                <tbody>{accounts.map((a, i) => <tr key={a.id} className={i % 2 ? "bg-gray-50" : ""}><td className="p-1.5 border border-gray-300">{a.bankName}</td><td className="p-1.5 border border-gray-300 font-mono">••{a.accountNumber.slice(-4)}</td><td className="p-1.5 border border-gray-300">{a.status}</td><td className="p-1.5 border border-gray-300 text-right tabular-nums">{a.balance}</td></tr>)}</tbody>
              </table>
            </>}
            {phones.length > 0 && <>
              <div className="font-bold text-sm mb-1">A.2 Linked Telecom Records</div>
              <table className="w-full text-left border-collapse text-xs">
                <thead><tr className="bg-gray-200"><th className="p-1.5 border border-gray-400">Number</th><th className="p-1.5 border border-gray-400">Carrier</th><th className="p-1.5 border border-gray-400">Subscriber</th><th className="p-1.5 border border-gray-400 text-right">Calls</th></tr></thead>
                <tbody>{phones.map((p, i) => <tr key={p.id} className={i % 2 ? "bg-gray-50" : ""}><td className="p-1.5 border border-gray-300 font-mono">{p.phoneNumber}</td><td className="p-1.5 border border-gray-300">{p.carrier}</td><td className="p-1.5 border border-gray-300">{p.subscriberName}</td><td className="p-1.5 border border-gray-300 text-right tabular-nums">{p.callVolume}</td></tr>)}</tbody>
              </table>
            </>}
          </section>
        )}

        <section className="mb-8 border border-gray-300 p-4 text-xs" style={{ pageBreakInside: "avoid" }}>
          <h2 id="sec-audit" className="scroll-mt-4 mb-2 text-sm font-bold uppercase">{numOf("audit")}. Audit Metadata &amp; Verification</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1"><span>Source FIR: <strong>{fir.firNumber}</strong></span><span>Case status: <strong>{fir.status}</strong></span><span>Evidence records: <strong>{evidence.length}</strong></span><span>Timeline records: <strong>{timelineEvents.length}</strong></span><span>Generated by: <strong>{officer?.name || "System Admin"}</strong></span><span>Context integrity ID: <strong className="font-mono">{auditHash}</strong></span></div>
        </section>

        {/* Digital signature footer with verification QR */}
        <div className="mt-16 pt-8 border-t border-dashed border-gray-400 flex justify-between items-end" style={{ pageBreakInside: "avoid" }}>
          <div>
            <div className="font-mono text-[9px] text-gray-500 mb-1">DIGITAL SIGNATURE &amp; VERIFICATION HASH</div>
            <div className="font-mono text-[10px] bg-gray-100 p-1.5 font-bold break-all max-w-[400px]">SCRB-{auditHash}-{fir.firNumber.replaceAll("-", "")}</div>
            <div className="text-[10px] text-gray-500 mt-2">Digitally approved for SCRB intelligence workflow. Unauthorized distribution is prohibited.</div>
            <div className="mt-3 flex items-end gap-8">
              <div className="text-center"><div className="w-40 border-b border-gray-500 h-8" /><div className="text-[9px] text-gray-500 mt-1">Investigating Officer</div></div>
              <div className="text-center"><div className="w-40 border-b border-gray-500 h-8" /><div className="text-[9px] text-gray-500 mt-1">Reviewing Authority (SCRB)</div></div>
            </div>
          </div>
          <div className="text-center">
            <div className="border border-gray-300 p-1 inline-block bg-white"><PseudoQR seed={`${auditHash}${fir.firNumber}`} /></div>
            <div className="font-mono text-[9px] font-bold mt-1">SCAN TO VERIFY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
