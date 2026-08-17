"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import {
  User, Palette, Compass, Bell, ShieldCheck, Database, Command, Info,
  Check, Monitor, LogOut, Trash2, Cpu, GitBranch, Layers,
} from "lucide-react";

type SectionId = "profile" | "appearance" | "investigation" | "notifications" | "security" | "data" | "shortcuts" | "about";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "investigation", label: "Investigation", icon: Compass },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Session", icon: ShieldCheck },
  { id: "data", label: "Data & Database", icon: Database },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Command },
  { id: "about", label: "About", icon: Info },
];

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${checked ? "bg-primary" : "bg-card border border-border"}`}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`} />
  </button>
);

const Row: React.FC<{ title: string; desc?: string; children: React.ReactNode; icon?: React.ElementType }> = ({ title, desc, children, icon: Icon }) => (
  <div className="flex items-center justify-between gap-6 px-5 py-4">
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />} {title}
      </div>
      {desc && <p className="mt-0.5 text-[13px] text-gray-400 leading-relaxed">{desc}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="surface-panel overflow-hidden">
    {title && <div className="px-5 py-3 border-b border-border/60 text-[11px] font-semibold uppercase tracking-widest text-gray-500">{title}</div>}
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

const Select: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:border-primary outline-none cursor-pointer">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

export default function SettingsPage() {
  const { officer } = useInvestigation();
  const [section, setSection] = useState<SectionId>("profile");
  const [saved, setSaved] = useState(false);

  // A few genuinely-persisted preferences.
  const [prefs, setPrefs] = useState({
    density: "Comfortable", accent: "Blue", sidebar: "Expanded",
    landing: "Dashboard", autoLoadCase: true, mapStyle: "Dark", graphPhysics: "Balanced", showConfidence: true,
    critical: true, sound: true, digest: false, hotspotSpike: true, suspectHit: true,
    autoLock: "30 minutes", exportFormat: "PDF",
  });
  const set = <K extends keyof typeof prefs>(k: K, v: (typeof prefs)[K]) => setPrefs(p => ({ ...p, [k]: v }));

  useEffect(() => {
    try { const s = localStorage.getItem("crimeLensPrefs"); if (s) setPrefs(p => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ }
  }, []);

  const save = () => {
    try { localStorage.setItem("crimeLensPrefs", JSON.stringify(prefs)); } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = useMemo(() => (officer?.name || "KP").split(" ").filter(p => !p.includes(".")).map(p => p[0]).join("").slice(0, 2).toUpperCase(), [officer]);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your profile, preferences, and command-centre configuration.</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${saved ? "bg-semantic-success/15 text-semantic-success border border-semantic-success/30" : "bg-primary hover:bg-primary-hover text-white"}`}>
          <Check className="w-4 h-4" /> {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6 items-start">
        {/* Section nav */}
        <nav className="surface-panel p-2 md:sticky md:top-4">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/15 text-white" : "text-gray-400 hover:text-white hover:bg-card/60"}`}>
                <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} /> {s.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="space-y-5 min-w-0">
          {section === "profile" && (
            <>
              <Card>
                <div className="flex items-center gap-4 p-5">
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center text-xl font-bold">{initials}</div>
                  <div>
                    <div className="text-lg font-bold text-white">{officer?.name || "KSP Officer"}</div>
                    <div className="text-sm text-gray-400">{officer?.role || "Inspector"} · {officer?.district || "SCRB"}</div>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-semantic-success"><ShieldCheck className="w-3 h-3" /> Verified officer account</span>
                  </div>
                </div>
              </Card>
              <Card title="Officer details">
                <Row title="Badge ID" desc="Issued by Karnataka State Police">{<span className="font-mono text-sm text-gray-200">{officer?.badgeId || "—"}</span>}</Row>
                <Row title="Jurisdiction">{<span className="text-sm text-gray-200">{officer?.station || "—"}</span>}</Row>
                <Row title="District">{<span className="text-sm text-gray-200">{officer?.district || "—"}</span>}</Row>
                <Row title="Clearance" desc="Managed centrally by SCRB HQ">{<span className="rounded-md bg-semantic-warning/15 text-semantic-warning px-2 py-1 text-xs font-bold">RESTRICTED</span>}</Row>
              </Card>
            </>
          )}

          {section === "appearance" && (
            <Card title="Appearance">
              <Row title="Theme" desc="Light theme is on the roadmap." icon={Monitor}><Select value="Dark" onChange={() => {}} options={["Dark"]} /></Row>
              <Row title="Accent colour" desc="Applied to primary actions and highlights.">
                <div className="flex gap-2">
                  {(["Blue", "Cyan", "Violet"] as const).map(c => (
                    <button key={c} onClick={() => set("accent", c)} className={`h-7 w-7 rounded-full border-2 ${prefs.accent === c ? "border-white" : "border-transparent"}`} style={{ backgroundColor: c === "Blue" ? "#2563eb" : c === "Cyan" ? "#06b6d4" : "#8b5cf6" }} title={c} />
                  ))}
                </div>
              </Row>
              <Row title="Density" desc="Spacing rhythm across tables and cards."><Select value={prefs.density} onChange={v => set("density", v)} options={["Comfortable", "Compact"]} /></Row>
              <Row title="Sidebar on launch"><Select value={prefs.sidebar} onChange={v => set("sidebar", v)} options={["Expanded", "Collapsed"]} /></Row>
            </Card>
          )}

          {section === "investigation" && (
            <Card title="Investigation preferences">
              <Row title="Default landing view" desc="Where CrimeLens opens after sign-in."><Select value={prefs.landing} onChange={v => set("landing", v)} options={["Dashboard", "Operations Map", "Network Graph", "Workspace"]} /></Row>
              <Row title="Auto-load last case" desc="Reopen your most recent investigation automatically."><Toggle checked={prefs.autoLoadCase} onChange={v => set("autoLoadCase", v)} /></Row>
              <Row title="Default map style"><Select value={prefs.mapStyle} onChange={v => set("mapStyle", v)} options={["Dark", "Satellite", "Streets"]} /></Row>
              <Row title="Graph physics" desc="Layout spread for the network graph."><Select value={prefs.graphPhysics} onChange={v => set("graphPhysics", v)} options={["Tight", "Balanced", "Spread"]} /></Row>
              <Row title="Show AI confidence" desc="Display confidence scores on Copilot answers."><Toggle checked={prefs.showConfidence} onChange={v => set("showConfidence", v)} /></Row>
            </Card>
          )}

          {section === "notifications" && (
            <Card title="Notifications & alerts">
              <Row title="Critical case alerts" desc="Escalations on the active investigation." icon={Bell}><Toggle checked={prefs.critical} onChange={v => set("critical", v)} /></Row>
              <Row title="Sound on critical events"><Toggle checked={prefs.sound} onChange={v => set("sound", v)} /></Row>
              <Row title="Hotspot spike alerts" desc="New incident clusters in your district."><Toggle checked={prefs.hotspotSpike} onChange={v => set("hotspotSpike", v)} /></Row>
              <Row title="High-risk suspect detection" desc="ANPR / facial-recognition matches."><Toggle checked={prefs.suspectHit} onChange={v => set("suspectHit", v)} /></Row>
              <Row title="Daily intelligence digest" desc="Email summary at 08:00 IST."><Toggle checked={prefs.digest} onChange={v => set("digest", v)} /></Row>
            </Card>
          )}

          {section === "security" && (
            <>
              <Card title="Security">
                <Row title="Two-factor authentication" desc="Enforced by SCRB HQ for all officers."><span className="rounded-md bg-semantic-success/15 text-semantic-success px-2 py-1 text-xs font-bold">ENABLED</span></Row>
                <Row title="Auto-lock after inactivity"><Select value={prefs.autoLock} onChange={v => set("autoLock", v)} options={["5 minutes", "15 minutes", "30 minutes", "1 hour"]} /></Row>
                <Row title="Session integrity hash">{<span className="font-mono text-xs text-gray-400">0x8F4A…2A3B</span>}</Row>
              </Card>
              <Card title="Active session">
                <Row title="This device" desc="Windows · Chrome · Bengaluru, IN"><span className="inline-flex items-center gap-1 text-xs text-semantic-success"><span className="w-1.5 h-1.5 rounded-full bg-semantic-success" /> Active now</span></Row>
                <div className="p-4">
                  <button className="flex items-center gap-2 rounded-lg border border-semantic-danger/30 bg-semantic-danger/10 px-3 py-2 text-sm font-semibold text-semantic-danger hover:bg-semantic-danger/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign out of all other sessions
                  </button>
                </div>
              </Card>
            </>
          )}

          {section === "data" && (
            <Card title="Data & database">
              <Row title="SCRB database" desc="Zoho Catalyst · Stratus cluster"><span className="inline-flex items-center gap-1 text-xs text-semantic-success"><span className="w-1.5 h-1.5 rounded-full bg-semantic-success" /> Connected</span></Row>
              <Row title="Default report export"><Select value={prefs.exportFormat} onChange={v => set("exportFormat", v)} options={["PDF", "Print"]} /></Row>
              <Row title="Local cache" desc="Recent cases, conversations, and tasks stored in this browser.">
                <button onClick={() => { try { sessionStorage.clear(); } catch {} location.href = "/login/"; }} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-gray-200 hover:text-white hover:bg-card-hover transition-colors">
                  <Trash2 className="w-4 h-4" /> Clear cache
                </button>
              </Row>
            </Card>
          )}

          {section === "shortcuts" && (
            <Card title="Keyboard shortcuts">
              {[
                ["Open command palette / search", "Ctrl", "K"],
                ["Go to Dashboard", "G", "D"],
                ["Go to Network Graph", "G", "N"],
                ["Open AI Copilot", "G", "C"],
                ["Print / export report", "Ctrl", "P"],
                ["Close dialog / drawer", "Esc"],
              ].map(([label, ...keys]) => (
                <div key={label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-300">{label}</span>
                  <span className="flex items-center gap-1">
                    {keys.map(k => <kbd key={k} className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-mono text-gray-300">{k}</kbd>)}
                  </span>
                </div>
              ))}
            </Card>
          )}

          {section === "about" && (
            <>
              <Card>
                <div className="p-5 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div>
                  <div>
                    <div className="text-lg font-bold text-white">CrimeLens<span className="text-primary">.AI</span></div>
                    <div className="text-sm text-gray-400">Karnataka State Police · State Crime Records Bureau</div>
                  </div>
                </div>
              </Card>
              <Card title="Version & build">
                <Row title="Version" icon={GitBranch}>{<span className="font-mono text-sm text-gray-200">v1.0.0</span>}</Row>
                <Row title="Build" icon={Cpu}>{<span className="font-mono text-sm text-gray-200">KSP-2026 · Next.js 14</span>}</Row>
                <Row title="Rendering engines" icon={Layers}>{<span className="text-sm text-gray-200">Mapbox GL · Cytoscape · Recharts</span>}</Row>
                <Row title="Environment">{<span className="text-sm text-gray-200">Production</span>}</Row>
              </Card>
              <p className="px-1 text-xs text-gray-500 leading-relaxed">CrimeLens AI is an internal intelligence platform. Access is restricted to authorised Karnataka State Police personnel. Unauthorised use is prohibited and audited.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
