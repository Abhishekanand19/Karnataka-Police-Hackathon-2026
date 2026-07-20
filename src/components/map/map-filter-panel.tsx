"use client";

import React, { useState } from "react";
import { Filter, RotateCcw, ChevronLeft, ChevronRight, Sliders, MapPin, Shield, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MapFilterState {
  district: string;
  policeStation: string;
  category: string;
  risk: string;
  status: string;
  dateRange: string;
  heatmapOpacity: number;
}

const initialMapFilters: MapFilterState = {
  district: "all",
  policeStation: "all",
  category: "all",
  risk: "all",
  status: "all",
  dateRange: "30d",
  heatmapOpacity: 0.8,
};

export interface MapFilterPanelProps {
  onFilterChange: (filters: MapFilterState) => void;
}

export const MapFilterPanel: React.FC<MapFilterPanelProps> = ({ onFilterChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState<MapFilterState>(initialMapFilters);

  const handleChange = (key: keyof MapFilterState, value: any) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const handleReset = () => {
    setFilters(initialMapFilters);
    onFilterChange(initialMapFilters);
  };

  return (
    <div
      className={`relative bg-card border border-card-border rounded-xl shadow-xl flex flex-col transition-all duration-300 ${
        collapsed ? "w-14" : "w-full lg:w-72"
      }`}
    >
      {/* Header Bar */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <Filter className="w-4 h-4 text-primary" />
            <span>Map Filters</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors ml-auto"
          title={collapsed ? "Expand Filters" : "Collapse Filters"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[540px] text-xs">
          {/* Heatmap Opacity Control */}
          <div className="space-y-1.5 p-2.5 bg-surface/60 rounded-xl border border-border/60">
            <div className="flex justify-between items-center text-gray-300 font-medium">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-accent" /> Density Heatmap
              </span>
              <span className="font-mono text-accent">{Math.round(filters.heatmapOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={filters.heatmapOpacity}
              onChange={(e) => handleChange("heatmapOpacity", parseFloat(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          {/* District Dropdown */}
          <div className="space-y-1">
            <label className="text-gray-400 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Target District
            </label>
            <select
              value={filters.district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="w-full bg-surface text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="all">All Karnataka Districts (25)</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Mysuru City">Mysuru City</option>
              <option value="Dakshina Kannada">Dakshina Kannada</option>
              <option value="Belagavi">Belagavi</option>
              <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
              <option value="Kalaburagi">Kalaburagi</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-1">
            <label className="text-gray-400 font-medium flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-semantic-warning" /> Risk Severity
            </label>
            <select
              value={filters.risk}
              onChange={(e) => handleChange("risk", e.target.value)}
              className="w-full bg-surface text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="all">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {/* Crime Category */}
          <div className="space-y-1">
            <label className="text-gray-400 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-accent" /> Crime Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full bg-surface text-gray-200 border border-border rounded-input px-2.5 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              <option value="cyber">Cyber Crime</option>
              <option value="theft">Theft & Robbery</option>
              <option value="smuggling">Smuggling & Drugs</option>
              <option value="vehicle">Vehicle Theft</option>
            </select>
          </div>

          {/* Reset Action Button */}
          <Button
            variant="secondary"
            fullWidth
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Spatial Filters
          </Button>
        </div>
      )}
    </div>
  );
};
