"use client";

import React, { useState } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { MOCK_DB } from "@/lib/mock-database";
import { Search, MapPin, Briefcase, FileText, ChevronRight, Activity, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WorkspacePage() {
  const { officer, setInvestigation } = useInvestigation();
  const [query, setQuery] = useState("");

  const searchResults = query.trim().length > 1
    ? MOCK_DB.firs.filter(fir => 
        fir.firNumber.toLowerCase().includes(query.toLowerCase()) || 
        fir.category.toLowerCase().includes(query.toLowerCase()) ||
        fir.linkedSuspects.some(susId => {
          const suspect = MOCK_DB.suspects.find(s => s.id === susId);
          return suspect && (suspect.name.toLowerCase().includes(query.toLowerCase()) || suspect.alias?.toLowerCase().includes(query.toLowerCase()));
        })
      )
    : [];

  const handleSelectInvestigation = (firId: string) => {
    setInvestigation("FIR", "FIR Record", firId);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 md:p-8 items-center pt-16">
      
      <div className="w-full max-w-3xl space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {officer?.name?.split(' ')[1] || "Officer"}
          </h1>
          <p className="text-gray-400 text-lg">
            What would you like to investigate today?
          </p>
        </div>

        {/* Unified Search Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative bg-surface border border-border/80 rounded-2xl p-2 shadow-2xl flex items-center gap-3">
            <Search className="w-6 h-6 text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by FIR Number, Suspect Name, Vehicle, Phone, or Category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-0 py-3"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results Dropdown-like Area */}
        {query.trim().length > 1 && (
          <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4">
            <div className="px-4 py-2 bg-card/50 border-b border-border text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {searchResults.length} Results Found
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {searchResults.length > 0 ? searchResults.map(result => (
                <div 
                  key={result.id}
                  onClick={() => handleSelectInvestigation(result.firNumber)}
                  className="p-4 border-b border-border hover:bg-card/40 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{result.firNumber}</span>
                        <Badge variant="neutral" size="sm">{result.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{result.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {result.station}</span>
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Risk: {result.riskScore}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </div>
              )) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No matching intelligence records found in database.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Access Sections */}
        {!query.trim() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Pinned Cases */}
            <div className="bg-surface/50 border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-accent" /> Pinned Cases
              </div>
              <div className="space-y-2">
                {MOCK_DB.firs.slice(0, 2).map((fir) => (
                  <div 
                    key={fir.id}
                    onClick={() => handleSelectInvestigation(fir.firNumber)}
                    className="p-3 bg-card/30 border border-border/50 rounded-xl hover:border-primary/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-sm text-primary">{fir.firNumber}</span>
                      <Badge variant="neutral" size="sm">{fir.status}</Badge>
                    </div>
                    <div className="text-xs text-gray-300 font-medium truncate">{fir.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Alerts */}
            <div className="bg-surface/50 border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-semantic-danger" /> Emerging Threats
              </div>
              <div className="space-y-2">
                {MOCK_DB.emergingAlerts.slice(0, 2).map((alert) => (
                  <div 
                    key={alert.id}
                    onClick={() => handleSelectInvestigation(alert.firId)}
                    className="p-3 bg-card/30 border border-border/50 rounded-xl hover:border-semantic-danger/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-white">{alert.title}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{alert.time}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
