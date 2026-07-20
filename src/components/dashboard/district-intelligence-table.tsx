"use client";

import React, { useState } from "react";
import { Panel } from "@/components/ui/panel";
import { TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table-wrapper";
import { RiskBadge, RiskLevel } from "@/components/ui/risk-badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Drawer } from "@/components/ui/drawer";
import { ArrowUpDown, Eye, ShieldAlert, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export interface DistrictRow {
  id: string;
  name: string;
  count: number;
  risk: RiskLevel;
  riskScore: number;
  trend: string;
  openCases: number;
  solvedRate: string;
  policeStations: number;
}

const mockDistricts: DistrictRow[] = [
  { id: "DIST-01", name: "Bengaluru Urban", count: 4120, risk: "Critical", riskScore: 88, trend: "+8.4%", openCases: 1240, solvedRate: "69.9%", policeStations: 42 },
  { id: "DIST-02", name: "Mysuru City", count: 1850, risk: "High", riskScore: 76, trend: "+4.1%", openCases: 480, solvedRate: "74.0%", policeStations: 18 },
  { id: "DIST-03", name: "Dakshina Kannada", count: 1420, risk: "High", riskScore: 71, trend: "-1.2%", openCases: 390, solvedRate: "72.5%", policeStations: 16 },
  { id: "DIST-04", name: "Belagavi", count: 980, risk: "Medium", riskScore: 58, trend: "+2.0%", openCases: 240, solvedRate: "75.5%", policeStations: 14 },
  { id: "DIST-05", name: "Hubballi-Dharwad", count: 840, risk: "Medium", riskScore: 54, trend: "-0.5%", openCases: 190, solvedRate: "77.3%", policeStations: 12 },
  { id: "DIST-06", name: "Kalaburagi", count: 760, risk: "Medium", riskScore: 51, trend: "+1.8%", openCases: 180, solvedRate: "76.3%", policeStations: 10 },
  { id: "DIST-07", name: "Tumakuru", count: 620, risk: "Low", riskScore: 42, trend: "-3.1%", openCases: 110, solvedRate: "82.2%", policeStations: 9 },
  { id: "DIST-08", name: "Ballari", count: 590, risk: "Low", riskScore: 39, trend: "-2.4%", openCases: 95, solvedRate: "83.8%", policeStations: 8 },
  { id: "DIST-09", name: "Shivamogga", count: 510, risk: "Low", riskScore: 36, trend: "-1.1%", openCases: 80, solvedRate: "84.3%", policeStations: 7 },
  { id: "DIST-10", name: "Udupi", count: 480, risk: "Low", riskScore: 32, trend: "-4.0%", openCases: 65, solvedRate: "86.4%", policeStations: 6 },
];

export const DistrictIntelligenceTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof DistrictRow>("count");
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictRow | null>(null);

  const pageSize = 5;

  const handleSort = (field: keyof DistrictRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = mockDistricts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Panel
      title="District Intelligence Risk Index"
      action={
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Search district..."
            onSearch={(q) => {
              setSearch(q);
              setCurrentPage(1);
            }}
            className="w-48"
          />
        </div>
      }
    >
      <TableWrapper>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
              <div className="flex items-center gap-1">
                District Name <ArrowUpDown className="w-3 h-3 text-gray-400" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort("count")}>
              <div className="flex items-center gap-1">
                Crime Volume <ArrowUpDown className="w-3 h-3 text-gray-400" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort("riskScore")}>
              <div className="flex items-center gap-1">
                Risk Classification <ArrowUpDown className="w-3 h-3 text-gray-400" />
              </div>
            </TableHead>
            <TableHead>Trend</TableHead>
            <TableHead className="cursor-pointer select-none" onClick={() => handleSort("openCases")}>
              <div className="flex items-center gap-1">
                Open FIRs <ArrowUpDown className="w-3 h-3 text-gray-400" />
              </div>
            </TableHead>
            <TableHead>Clearance Rate</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-semibold text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{row.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono font-bold text-gray-100">
                {row.count.toLocaleString()}
              </TableCell>
              <TableCell>
                <RiskBadge level={row.risk} score={row.riskScore} />
              </TableCell>
              <TableCell className="font-mono text-xs">
                <span className={row.trend.startsWith("+") ? "text-semantic-danger font-medium" : "text-semantic-success font-medium"}>
                  {row.trend}
                </span>
              </TableCell>
              <TableCell className="font-mono text-gray-300">{row.openCases}</TableCell>
              <TableCell className="font-mono text-semantic-success">{row.solvedRate}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedDistrict(row)}
                >
                  Inspect
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-gray-400">
        <div>
          Showing {paginated.length} of {filtered.length} Karnataka Districts
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            icon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Prev
          </Button>
          <span className="font-mono text-gray-200">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            icon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Inspect Drawer */}
      <Drawer
        isOpen={!!selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
        title={selectedDistrict ? `${selectedDistrict.name} Intelligence Dossier` : ""}
      >
        {selectedDistrict && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">District ID:</span>
                <span className="font-mono text-white font-bold">{selectedDistrict.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Risk Assessment:</span>
                <RiskBadge level={selectedDistrict.risk} score={selectedDistrict.riskScore} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Police Stations:</span>
                <span className="font-mono text-gray-200">{selectedDistrict.policeStations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Clearance Rate:</span>
                <span className="font-mono text-semantic-success">{selectedDistrict.solvedRate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Key Operational Observations
              </h5>
              <div className="p-3 bg-surface/60 rounded-xl border border-border/60 text-gray-300 leading-relaxed">
                {selectedDistrict.name} currently exhibits {selectedDistrict.openCases} pending FIR investigations. Primary crime vectors include property theft & financial cyber fraud.
              </div>
            </div>

            <Button variant="primary" fullWidth icon={<ShieldAlert className="w-4 h-4" />}>
              Open Full Spatial Hotspot Map
            </Button>
          </div>
        )}
      </Drawer>
    </Panel>
  );
};
