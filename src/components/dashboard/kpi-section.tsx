"use client";

import React from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { FileText, Search, CheckCircle2, ShieldAlert, Users, Flame } from "lucide-react";

const sparklineData = {
  total: [{ v: 400 }, { v: 420 }, { v: 410 }, { v: 450 }, { v: 430 }, { v: 480 }, { v: 510 }],
  open: [{ v: 220 }, { v: 210 }, { v: 205 }, { v: 198 }, { v: 190 }, { v: 185 }, { v: 180 }],
  solved: [{ v: 300 }, { v: 310 }, { v: 340 }, { v: 360 }, { v: 380 }, { v: 400 }, { v: 420 }],
  hotspots: [{ v: 8 }, { v: 9 }, { v: 9 }, { v: 10 }, { v: 11 }, { v: 11 }, { v: 12 }],
  offenders: [{ v: 150 }, { v: 155 }, { v: 160 }, { v: 165 }, { v: 170 }, { v: 175 }, { v: 184 }],
  alerts: [{ v: 4 }, { v: 5 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 7 }, { v: 8 }],
};

export const KpiSection: React.FC = () => {
  const kpis = [
    {
      title: "Total Registered Cases",
      value: "15,420",
      trend: { value: "4.2%", direction: "up" as const, label: "vs last month" },
      icon: <FileText className="w-5 h-5 text-primary" />,
      sparkColor: "#2563EB",
      data: sparklineData.total,
    },
    {
      title: "Open Investigations",
      value: "4,120",
      trend: { value: "2.1%", direction: "down" as const, label: "faster resolution" },
      icon: <Search className="w-5 h-5 text-semantic-info" />,
      sparkColor: "#3B82F6",
      data: sparklineData.open,
    },
    {
      title: "Solved Cases",
      value: "11,300",
      trend: { value: "5.8%", direction: "down" as const, label: "73.2% clearance rate" },
      icon: <CheckCircle2 className="w-5 h-5 text-semantic-success" />,
      sparkColor: "#22C55E",
      data: sparklineData.solved,
    },
    {
      title: "Active Hotspots",
      value: "12",
      trend: { value: "2", direction: "up" as const, label: "emerging clusters" },
      icon: <ShieldAlert className="w-5 h-5 text-semantic-warning" />,
      sparkColor: "#F59E0B",
      data: sparklineData.hotspots,
    },
    {
      title: "Repeat Offenders",
      value: "1,840",
      trend: { value: "1.5%", direction: "up" as const, label: "linked to 3+ FIRs" },
      icon: <Users className="w-5 h-5 text-accent" />,
      sparkColor: "#06B6D4",
      data: sparklineData.offenders,
    },
    {
      title: "Critical Security Alerts",
      value: "8",
      trend: { value: "3", direction: "up" as const, label: "high priority" },
      icon: <Flame className="w-5 h-5 text-semantic-danger" />,
      sparkColor: "#EF4444",
      data: sparklineData.alerts,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative group overflow-hidden"
        >
          <StatCard
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
            className="h-full justify-between"
          />

          {/* Mini Sparkline Overlay */}
          <div className="h-8 w-full mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.data}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={kpi.sparkColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
