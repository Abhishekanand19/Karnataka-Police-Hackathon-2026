"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

const weeklyTrendData = [
  { day: "Mon", cases: 410, solved: 320, cyber: 110 },
  { day: "Tue", cases: 380, solved: 290, cyber: 95 },
  { day: "Wed", cases: 450, solved: 340, cyber: 140 },
  { day: "Thu", cases: 490, solved: 380, cyber: 160 },
  { day: "Fri", cases: 580, solved: 410, cyber: 210 },
  { day: "Sat", cases: 640, solved: 450, cyber: 230 },
  { day: "Sun", cases: 610, solved: 430, cyber: 190 },
];

const monthlyTrendData = [
  { month: "Jan", volume: 1120, open: 340 },
  { month: "Feb", volume: 1080, open: 310 },
  { month: "Mar", volume: 1240, open: 390 },
  { month: "Apr", volume: 1310, open: 420 },
  { month: "May", volume: 1420, open: 460 },
  { month: "Jun", volume: 1380, open: 410 },
  { month: "Jul", volume: 1540, open: 510 },
];

const hourlyPatternData = [
  { hour: "00:00", count: 180 },
  { hour: "03:00", count: 240 },
  { hour: "06:00", count: 90 },
  { hour: "09:00", count: 140 },
  { hour: "12:00", count: 210 },
  { hour: "15:00", count: 290 },
  { hour: "18:00", count: 420 },
  { hour: "21:00", count: 530 },
];

const categoryDistribution = [
  { name: "Cyber Crime", value: 4200, color: "#06B6D4" },
  { name: "Theft & Burglary", value: 3800, color: "#2563EB" },
  { name: "Financial Fraud", value: 2900, color: "#F59E0B" },
  { name: "Assault", value: 2100, color: "#EF4444" },
  { name: "Drug Offence", value: 1400, color: "#22C55E" },
  { name: "Vehicle Theft", value: 1020, color: "#8B5CF6" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-border p-3 rounded-lg shadow-xl text-xs space-y-1">
        <div className="font-semibold text-white">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendChartsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2 Cols - Main Trend Analytics */}
      <div className="lg:col-span-2 space-y-6">
        <Panel
          title="Statewide Temporal Crime Progression"
          action={
            <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeTab === "weekly" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                7-Day View
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeTab === "monthly" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                2026 Monthly
              </button>
            </div>
          }
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "weekly" ? (
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCyber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cases"
                    name="Total Incidents"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCases)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cyber"
                    name="Cyber Crimes"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCyber)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" name="Total Volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="open" name="Unsolved Backlog" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Hourly Nighttime Crime Pattern */}
        <Panel title="Diurnal / Hourly Incident Distribution">
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Incidents Reported" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-xs text-semantic-warning font-medium">
            * Peak Crime Hours Identified: 21:00 - 03:00 IST (Nighttime property theft & robbery concentration)
          </div>
        </Panel>
      </div>

      {/* 1 Col - Category Distribution Pie */}
      <div className="space-y-6">
        <Panel title="Crime Category Breakdown">
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1F2937" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/50 border border-border/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};
