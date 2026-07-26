"use client";

import React, { useState } from "react";
import { FileText, Settings, History, Check, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";
import { Badge } from "@/components/ui/badge";

export interface ReportConfig {
  reportType: string;
  includeTimeline: boolean;
  includeEvidence: boolean;
  includeNetwork: boolean;
  includeHotspot: boolean;
  includeAI: boolean;
  includeEntities: boolean;
}

interface SidebarProps {
  config: ReportConfig;
  setConfig: (config: ReportConfig) => void;
  onGenerate: () => void;
}

export const ReportConfigurationSidebar: React.FC<SidebarProps> = ({ config, setConfig, onGenerate }) => {
  const router = useRouter();
  const { activeInvestigation } = useInvestigation();
  const [activeTab, setActiveTab] = useState<"configure" | "history">("configure");

  const reportTypes = [
    "Investigation Summary",
    "FIR Intelligence Report",
    "Officer Briefing",
    "Daily Crime Brief",
    "Hotspot Analysis Report",
    "Suspect Profile Report",
    "Crime Network Analysis",
    "AI Investigation Report",
    "Executive Summary"
  ];

  if (!activeInvestigation) {
    return (
      <div className="flex flex-col h-full bg-surface border-r border-border/80 p-6 items-center justify-center text-center">
        <FileText className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-white font-bold mb-2">No Context Selected</h3>
        <p className="text-sm text-gray-400 mb-6">Load an investigation to generate official intelligence reports.</p>
        <button onClick={() => router.push("/workspace")} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm">
          Select Investigation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border/80 shadow-2xl">
      
      {/* Header */}
      <div className="p-5 border-b border-border/50 bg-card/30">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Report Centre
        </h2>
        <div className="text-xs text-gray-400 mt-1 font-mono">{activeInvestigation.entityId}</div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button 
          onClick={() => setActiveTab("configure")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'configure' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Settings className="w-3.5 h-3.5" /> Configure
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <History className="w-3.5 h-3.5" /> History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        
        {activeTab === "configure" ? (
          <div className="space-y-6">
            
            {/* Report Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report Template</label>
              <select 
                value={config.reportType}
                onChange={(e) => setConfig({ ...config, reportType: e.target.value })}
                className="w-full bg-card border border-border/80 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-colors"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Customization Toggles */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Include Sections</label>
              <div className="space-y-2">
                {[
                  { key: 'includeTimeline', label: 'Investigation Timeline' },
                  { key: 'includeEvidence', label: 'Evidence Summary' },
                  { key: 'includeNetwork', label: 'Network Graph Data' },
                  { key: 'includeHotspot', label: 'Hotspot Analysis' },
                  { key: 'includeAI', label: 'AI Risk & Predictive Analysis' },
                  { key: 'includeEntities', label: 'Victims & Suspects' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-card/50 transition-colors">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${config[item.key as keyof ReportConfig] ? 'bg-primary border-primary' : 'bg-transparent border-gray-600'}`}>
                      {config[item.key as keyof ReportConfig] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={config[item.key as keyof ReportConfig] as boolean}
                      onChange={(e) => setConfig({ ...config, [item.key]: e.target.checked })}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-semantic-warning/10 border border-semantic-warning/20 rounded-xl">
              <div className="text-[10px] font-bold text-semantic-warning uppercase flex items-center gap-1.5 mb-1">
                <ShieldAlert className="w-3 h-3" /> Digital Security Note
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Generated reports will be digitally signed, watermarked, and appended with a SHA-256 integrity hash.
              </p>
            </div>

          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 bg-card border border-border/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="accent" size="sm">PDF</Badge>
                  <span className="text-[10px] text-gray-500 font-mono">10:45 AM, Today</span>
                </div>
                <div className="font-bold text-sm text-white truncate">FIR Intelligence Report</div>
                <div className="text-[10px] text-gray-400">Ver 1.0 • Gen: Insp. V. Patil</div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <button className="flex-1 text-[10px] font-bold text-primary hover:text-white uppercase">Download</button>
                  <button className="flex-1 text-[10px] font-bold text-semantic-danger hover:text-white uppercase">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Footer */}
      {activeTab === "configure" && (
        <div className="p-5 border-t border-border/50 bg-card/30">
          <button 
            onClick={onGenerate}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
          >
            <FileText className="w-4 h-4" /> Generate Intelligence Report
          </button>
        </div>
      )}

    </div>
  );
};
