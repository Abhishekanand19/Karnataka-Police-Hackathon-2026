"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export const NetworkSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[400px]">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search global network (FIR, Name, Phone, Bank)..."
          className="w-full bg-surface/90 backdrop-blur-md border border-border/80 focus:border-primary rounded-2xl py-3 pl-12 pr-4 text-sm text-white shadow-xl outline-none transition-all placeholder:text-gray-500"
        />
        {/* Fake search results dropdown */}
        {query.length > 2 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface/95 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Results</div>
            <button className="w-full text-left px-4 py-3 hover:bg-card text-sm text-white border-t border-border/50">
              <span className="font-bold text-primary">Rajesh Kumar</span> (Primary Target)
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-card text-sm text-white border-t border-border/50">
              <span className="font-bold text-semantic-warning">FIR-2026-00491</span> (Cyber Fraud)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
