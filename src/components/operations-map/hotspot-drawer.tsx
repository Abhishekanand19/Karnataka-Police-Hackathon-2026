"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Hotspot, MOCK_DB } from "@/lib/mock-database";
import { useInvestigation } from "@/providers/investigation-provider";
import { 
  MapPin, AlertTriangle, ShieldCheck, FileText, 
  LayoutDashboard, GitFork, History, Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HotspotDrawerProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const HotspotDrawer: React.FC<HotspotDrawerProps> = ({ hotspot, onClose }) => {
  const router = useRouter();
  const { setInvestigation } = useInvestigation();

  if (!hotspot) return null;

  // Find a related FIR to show context (just for demo purposes)
  const relatedFir = MOCK_DB.firs.find(f => f.station === hotspot.policeStation) || MOCK_DB.firs[0];

  const handleAction = (path: string, assignContext: boolean = false) => {
    if (assignContext && relatedFir) {
      setInvestigation("FIR", "FIR Record", relatedFir.firNumber);
    }
    router.push(path);
  };

  return (
    <Drawer
      isOpen={!!hotspot}
      onClose={onClose}
      title="Hotspot Intelligence"
      size="md"
    >
      <div className="space-y-6 text-sm">
        
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={hotspot.risk === "Critical" ? "danger" : hotspot.risk === "High" ? "warning" : "accent"}>
              {hotspot.risk} Risk Zone
            </Badge>
            <span className="text-gray-400 font-mono text-xs">Score: {hotspot.riskScore}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{hotspot.name}</h2>
          <div className="flex items-center gap-4 text-gray-400 text-xs font-mono">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {hotspot.district}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {hotspot.policeStation}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-surface/50 border border-border/80 rounded-xl">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Cases</div>
            <div className="text-lg font-bold text-white">{hotspot.cases.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-surface/50 border border-border/80 rounded-xl">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Repeat Offenders</div>
            <div className="text-lg font-bold text-white">{hotspot.repeatOffenders}</div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> AI Sector Analysis
          </div>
          <p className="text-gray-300 leading-relaxed text-xs">
            This sector is experiencing a {hotspot.trend} trend primarily driven by {hotspot.topCrime}. 
            Historical data suggests a correlation with recent organized crime activities in neighboring districts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Command Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleAction("/", true)}
              className="flex items-center justify-center gap-2 p-3 bg-card hover:bg-card-hover border border-border rounded-xl text-white font-semibold transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              Open Dashboard
            </button>
            <button 
              onClick={() => handleAction("/network", true)}
              className="flex items-center justify-center gap-2 p-3 bg-card hover:bg-card-hover border border-border rounded-xl text-white font-semibold transition-colors"
            >
              <GitFork className="w-4 h-4 text-accent" />
              View Network
            </button>
            <button 
              onClick={() => handleAction("/timeline", true)}
              className="flex items-center justify-center gap-2 p-3 bg-card hover:bg-card-hover border border-border rounded-xl text-white font-semibold transition-colors"
            >
              <History className="w-4 h-4 text-semantic-warning" />
              Open Timeline
            </button>
            <button 
              onClick={() => handleAction("/reports", true)}
              className="flex items-center justify-center gap-2 p-3 bg-card hover:bg-card-hover border border-border rounded-xl text-white font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              Generate Report
            </button>
          </div>

          <button 
            onClick={() => handleAction("/", true)}
            className="w-full mt-2 flex items-center justify-center gap-2 p-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            <Target className="w-4 h-4" />
            Investigate Related Case ({relatedFir.firNumber})
          </button>
        </div>

      </div>
    </Drawer>
  );
};
