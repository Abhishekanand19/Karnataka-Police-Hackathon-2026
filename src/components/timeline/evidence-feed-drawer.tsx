"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Camera, CreditCard, Phone, Car, FileSearch, Download, Eye } from "lucide-react";

export interface EvidenceFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceFeedDrawer: React.FC<EvidenceFeedDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "docs" | "financial" | "phone" | "vehicle">("all");

  const evidenceFiles = [
    { id: "EVD-01", name: "CDR_Telecommunication_Logs.pdf", type: "docs", category: "Phone Logs", date: "16 Jan 2026", size: "2.4 MB" },
    { id: "EVD-02", name: "Canara_Bank_Mule_Account_Statement.csv", type: "financial", category: "Financial Log", date: "16 Jan 2026", size: "1.1 MB" },
    { id: "EVD-03", name: "Crime_Scene_Photo_Indiranagar.jpg", type: "all", category: "Scene Photo", date: "14 Jan 2026", size: "4.8 MB" },
    { id: "EVD-04", name: "Vehicle_Registration_KA01MJ8910.pdf", type: "vehicle", category: "Vehicle RTO", date: "20 Jan 2026", size: "850 KB" },
    { id: "EVD-05", name: "Witness_Statement_Anand_Sharma.pdf", type: "docs", category: "Witness Record", date: "15 Jan 2026", size: "1.8 MB" },
  ];

  const filtered = evidenceFiles.filter(
    (f) => activeTab === "all" || f.type === activeTab
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Case Evidentiary Asset Repository (FIR-2026-00491)"
      size="xl"
    >
      <div className="space-y-4 text-xs text-gray-200 select-none">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-xl overflow-x-auto">
          {[
            { id: "all", label: "All Evidence (5)", icon: FileSearch },
            { id: "docs", label: "Forensic Documents", icon: FileText },
            { id: "financial", label: "Financial Records", icon: CreditCard },
            { id: "phone", label: "Phone Logs", icon: Phone },
            { id: "vehicle", label: "Vehicle Records", icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected ? "bg-primary text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Evidence List */}
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-surface/70 rounded-xl border border-border flex items-center justify-between hover:border-gray-500 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{item.id}</span>
                  <Badge variant="accent" size="sm">{item.category}</Badge>
                </div>
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-[10px] text-gray-400 font-mono">
                  {item.date} • {item.size}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                  Preview
                </Button>
                <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
