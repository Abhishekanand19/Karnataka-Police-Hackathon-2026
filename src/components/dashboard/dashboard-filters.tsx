"use client";

import React, { useState } from "react";
import { Filter, RotateCcw, Calendar, MapPin, Shield, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterState {
  dateRange: string;
  district: string;
  policeStation: string;
  category: string;
  status: string;
  severity: string;
}

const initialFilters: FilterState = {
  dateRange: "30d",
  district: "all",
  policeStation: "all",
  category: "all",
  status: "all",
  severity: "all",
};

export interface DashboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleChange = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (onFilterChange) onFilterChange(next);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    if (onFilterChange) onFilterChange(initialFilters);
  };

  const activeCount = Object.values(filters).filter(
    (v, i) => v !== Object.values(initialFilters)[i]
  ).length;

  return (
    <div className="p-4 bg-surface/80 border border-border rounded-xl shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <Filter className="w-4 h-4 text-primary" />
          <span>Crime Intelligence Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
              {activeCount} Active
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3 h-3" />}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Date Range */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" /> Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleChange("dateRange", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="2026">Year 2026 (YTD)</option>
          </select>
        </div>

        {/* District Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> District
          </label>
          <select
            value={filters.district}
            onChange={(e) => handleChange("district", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="all">All Districts (25)</option>
            <option value="bengaluru_urban">Bengaluru Urban</option>
            <option value="mysuru">Mysuru City</option>
            <option value="dakshina_kannada">Dakshina Kannada</option>
            <option value="belagavi">Belagavi</option>
            <option value="hubballi_dharwad">Hubballi-Dharwad</option>
            <option value="kalaburagi">Kalaburagi</option>
          </select>
        </div>

        {/* Police Station */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-gray-400" /> Police Station
          </label>
          <select
            value={filters.policeStation}
            onChange={(e) => handleChange("policeStation", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="all">All Stations (120)</option>
            <option value="hsr_layout">HSR Layout PS</option>
            <option value="indiranagar">Indiranagar PS</option>
            <option value="devaraja">Devaraja PS</option>
            <option value="panambur">Panambur PS</option>
          </select>
        </div>

        {/* Crime Category */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-gray-400" /> Crime Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            <option value="cyber">Cyber Crime</option>
            <option value="robbery">Robbery & Theft</option>
            <option value="fraud">Financial Fraud</option>
            <option value="assault">Assault</option>
            <option value="drugs">Drug Offence</option>
          </select>
        </div>

        {/* Case Status */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="investigation">Under Investigation</option>
            <option value="chargesheeted">Chargesheet Filed</option>
            <option value="solved">Solved</option>
            <option value="pending">Pending Court</option>
          </select>
        </div>

        {/* Severity */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400" /> Severity Level
          </label>
          <select
            value={filters.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            className="bg-card text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
