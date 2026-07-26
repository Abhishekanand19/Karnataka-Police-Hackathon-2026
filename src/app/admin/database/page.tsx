"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MOCK_DB } from "@/lib/mock-database";
import { useInvestigation } from "@/providers/investigation-provider";
import {
  Database, Search, Shield, FileText, User, Phone, CreditCard, Truck, History, MapPin, ArrowRight, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TabType = "FIRs" | "Suspects" | "Victims" | "Evidence" | "Vehicles" | "Phone Records" | "Bank Accounts" | "Officers" | "Timeline" | "Hotspots";

export default function AdminDatabaseViewerPage() {
  const router = useRouter();
  const { setInvestigation } = useInvestigation();
  const [activeTab, setActiveTab] = useState<TabType>("FIRs");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSelectCase = (firNumber: string) => {
    setInvestigation("FIR", "FIR", firNumber);
    router.push("/");
  };

  const tabs: { type: TabType; label: string; count: number; icon: any }[] = [
    { type: "FIRs", label: "FIR Records", count: MOCK_DB.firs.length, icon: FileText },
    { type: "Suspects", label: "Suspects", count: MOCK_DB.suspects.length, icon: User },
    { type: "Victims", label: "Victims", count: (MOCK_DB.victims || []).length, icon: User },
    { type: "Evidence", label: "Evidence Ledger", count: MOCK_DB.evidence.length, icon: Shield },
    { type: "Vehicles", label: "Vehicles", count: (MOCK_DB.vehicles || []).length, icon: Truck },
    { type: "Phone Records", label: "CDR Logs", count: (MOCK_DB.phoneRecords || []).length, icon: Phone },
    { type: "Bank Accounts", label: "Mule Accounts", count: (MOCK_DB.bankAccounts || []).length, icon: CreditCard },
    { type: "Officers", label: "Officers", count: MOCK_DB.officers.length, icon: Shield },
    { type: "Timeline", label: "Timeline Events", count: MOCK_DB.timelineEvents.length, icon: History },
    { type: "Hotspots", label: "Hotspot Zones", count: MOCK_DB.hotspots.length, icon: MapPin },
  ];

  // Raw data selection
  const rawData = useMemo(() => {
    switch (activeTab) {
      case "FIRs": return MOCK_DB.firs;
      case "Suspects": return MOCK_DB.suspects;
      case "Victims": return MOCK_DB.victims || [];
      case "Evidence": return MOCK_DB.evidence;
      case "Vehicles": return MOCK_DB.vehicles || [];
      case "Phone Records": return MOCK_DB.phoneRecords || [];
      case "Bank Accounts": return MOCK_DB.bankAccounts || [];
      case "Officers": return MOCK_DB.officers;
      case "Timeline": return MOCK_DB.timelineEvents;
      case "Hotspots": return MOCK_DB.hotspots;
      default: return [];
    }
  }, [activeTab]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return rawData;
    const term = searchTerm.toLowerCase();
    return rawData.filter((item: any) =>
      Object.values(item).some(
        val => val && String(val).toLowerCase().includes(term)
      )
    );
  }, [rawData, searchTerm]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-6 space-y-6 overflow-y-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-surface border border-border rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 border border-primary/30 rounded-xl text-primary">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              KSP SCRB Master Database Explorer
              <Badge variant="accent">Synthetic SCRB Dataset</Badge>
            </h1>
            <p className="text-xs text-gray-400">
              Developer & Analyst inspection console for {MOCK_DB.firs.length} FIRs, {MOCK_DB.suspects.length} Suspects, and {MOCK_DB.evidence.length} Evidence Records.
            </p>
          </div>
        </div>

        {/* Global Filter */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder={`Search across ${filteredData.length} records...`}
            className="w-full bg-[#0b0e17] border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => handleTabChange(tab.type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-surface/60 hover:bg-surface text-gray-400 hover:text-white border-border/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-card border border-border text-gray-400"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col flex-1 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b0e17] border-b border-border text-gray-400 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                {activeTab === "FIRs" && (
                  <>
                    <th className="p-3">FIR Number</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Police Station</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Suspects" && (
                  <>
                    <th className="p-3">ID</th>
                    <th className="p-3">Suspect Name</th>
                    <th className="p-3">Alias</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Linked FIRs</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Victims" && (
                  <>
                    <th className="p-3">ID</th>
                    <th className="p-3">Victim Name</th>
                    <th className="p-3">Age / Gender</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Loss Amount</th>
                    <th className="p-3">Linked FIR</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Evidence" && (
                  <>
                    <th className="p-3">ID</th>
                    <th className="p-3">Evidence Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">File Size</th>
                    <th className="p-3">FIR ID</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Vehicles" && (
                  <>
                    <th className="p-3">Plate Number</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Registered Owner</th>
                    <th className="p-3">FIR ID</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Phone Records" && (
                  <>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Subscriber</th>
                    <th className="p-3">Carrier</th>
                    <th className="p-3">Call Volume</th>
                    <th className="p-3">FIR ID</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Bank Accounts" && (
                  <>
                    <th className="p-3">Account Number</th>
                    <th className="p-3">Bank Name</th>
                    <th className="p-3">Holder Name</th>
                    <th className="p-3">IFSC</th>
                    <th className="p-3">Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">FIR ID</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Officers" && (
                  <>
                    <th className="p-3">Badge ID</th>
                    <th className="p-3">Officer Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Police Station</th>
                  </>
                )}
                {activeTab === "Timeline" && (
                  <>
                    <th className="p-3">Event ID</th>
                    <th className="p-3">Step</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Officer</th>
                    <th className="p-3">FIR ID</th>
                    <th className="p-3 text-right">Action</th>
                  </>
                )}
                {activeTab === "Hotspots" && (
                  <>
                    <th className="p-3">Zone Name</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Police Station</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Cases</th>
                    <th className="p-3">Top Crime</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-gray-300">
              {paginatedData.map((item: any, idx: number) => (
                <tr key={item.id || idx} className="hover:bg-card/40 transition-colors">
                  {activeTab === "FIRs" && (
                    <>
                      <td className="p-3 font-mono font-bold text-white">{item.firNumber}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.district}</td>
                      <td className="p-3">{item.station}</td>
                      <td className="p-3 font-mono text-[11px] text-gray-400">{item.date}</td>
                      <td className="p-3 font-bold text-semantic-danger">{item.riskScore}</td>
                      <td className="p-3">
                        <Badge variant={item.status === "Closed" ? "neutral" : "danger"}>{item.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firNumber)}
                          className="px-2.5 py-1 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ml-auto"
                        >
                          Inspect Case <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Suspects" && (
                    <>
                      <td className="p-3 font-mono text-gray-400">{item.id}</td>
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3 text-gray-400">{item.alias || "-"}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3 font-bold text-semantic-warning">{item.riskScore}</td>
                      <td className="p-3"><Badge variant="danger">{item.status}</Badge></td>
                      <td className="p-3 font-mono text-[11px] text-primary">{item.linkedFIRs?.slice(0, 2).join(", ") || "-"}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.linkedFIRs?.[0] || "FIR-2026-00491")}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border hover:border-primary text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          View Linked FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Victims" && (
                    <>
                      <td className="p-3 font-mono text-gray-400">{item.id}</td>
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3">{item.age} / {item.gender}</td>
                      <td className="p-3">{item.district}</td>
                      <td className="p-3 font-mono text-gray-400">{item.phone}</td>
                      <td className="p-3 font-bold text-semantic-danger">{item.lossAmount}</td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Evidence" && (
                    <>
                      <td className="p-3 font-mono text-gray-400">{item.id}</td>
                      <td className="p-3 font-bold text-white">{item.title}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3 font-mono text-gray-400">{item.fileSize}</td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Vehicles" && (
                    <>
                      <td className="p-3 font-mono font-bold text-white">{item.plateNumber}</td>
                      <td className="p-3">{item.model}</td>
                      <td className="p-3 text-gray-400">{item.color}</td>
                      <td className="p-3"><Badge variant="warning">{item.status}</Badge></td>
                      <td className="p-3">{item.ownerName}</td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Phone Records" && (
                    <>
                      <td className="p-3 font-mono font-bold text-white">{item.phoneNumber}</td>
                      <td className="p-3">{item.subscriberName}</td>
                      <td className="p-3 text-gray-400">{item.carrier}</td>
                      <td className="p-3 font-mono text-semantic-accent">{item.callVolume} calls</td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Bank Accounts" && (
                    <>
                      <td className="p-3 font-mono font-bold text-white">{item.accountNumber}</td>
                      <td className="p-3">{item.bankName}</td>
                      <td className="p-3">{item.holderName}</td>
                      <td className="p-3 font-mono text-gray-400">{item.ifsc}</td>
                      <td className="p-3 font-bold text-semantic-danger">{item.balance}</td>
                      <td className="p-3"><Badge variant="danger">{item.status}</Badge></td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Officers" && (
                    <>
                      <td className="p-3 font-mono font-bold text-primary">{item.badgeId}</td>
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3">{item.role}</td>
                      <td className="p-3 text-gray-400">{item.district}</td>
                      <td className="p-3">{item.station}</td>
                    </>
                  )}

                  {activeTab === "Timeline" && (
                    <>
                      <td className="p-3 font-mono text-gray-400">{item.id}</td>
                      <td className="p-3 font-mono font-bold text-primary">Step #{item.stepNumber}</td>
                      <td className="p-3 font-bold text-white">{item.title}</td>
                      <td className="p-3"><Badge variant="accent">{item.category}</Badge></td>
                      <td className="p-3 text-gray-400">{item.officer}</td>
                      <td className="p-3 font-mono text-primary">{item.firId}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleSelectCase(item.firId)}
                          className="px-2.5 py-1 bg-surface hover:bg-primary border border-border text-white rounded-lg text-[11px] font-semibold transition-all ml-auto"
                        >
                          Inspect FIR
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "Hotspots" && (
                    <>
                      <td className="p-3 font-bold text-white">{item.name}</td>
                      <td className="p-3">{item.district}</td>
                      <td className="p-3 text-gray-400">{item.policeStation}</td>
                      <td className="p-3"><Badge variant={item.risk === "Critical" ? "danger" : "warning"}>{item.risk}</Badge></td>
                      <td className="p-3 font-bold text-semantic-danger">{item.riskScore}</td>
                      <td className="p-3 font-mono">{item.cases}</td>
                      <td className="p-3 text-gray-400">{item.topCrime}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 bg-[#0b0e17] border-t border-border flex items-center justify-between text-xs text-gray-400">
          <div>
            Showing <span className="text-white font-bold">{Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)}</span> to{" "}
            <span className="text-white font-bold">{Math.min(filteredData.length, currentPage * pageSize)}</span> of{" "}
            <span className="text-white font-bold">{filteredData.length}</span> records
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-surface border border-border hover:bg-card disabled:opacity-40 disabled:hover:bg-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-surface border border-border hover:bg-card disabled:opacity-40 disabled:hover:bg-surface transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
