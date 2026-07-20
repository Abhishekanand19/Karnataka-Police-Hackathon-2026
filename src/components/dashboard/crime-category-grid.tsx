"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Laptop, CreditCard, Crosshair, UserX, Pill, Car } from "lucide-react";

export const CrimeCategoryGrid: React.FC = () => {
  const categories = [
    { name: "Cyber Crime", count: "4,200", trend: "+12.4%", status: "up" as const, icon: Laptop, color: "text-accent" },
    { name: "Theft & Burglary", count: "3,800", trend: "+3.8%", status: "up" as const, icon: Shield, color: "text-primary" },
    { name: "Financial Fraud", count: "2,900", trend: "-1.5%", status: "down" as const, icon: CreditCard, color: "text-semantic-warning" },
    { name: "Robbery", count: "1,850", trend: "+2.1%", status: "up" as const, icon: Crosshair, color: "text-semantic-danger" },
    { name: "Assault & Violent", count: "2,100", trend: "-4.2%", status: "down" as const, icon: UserX, color: "text-semantic-info" },
    { name: "Drug Offence", count: "1,400", trend: "+6.0%", status: "up" as const, icon: Pill, color: "text-semantic-success" },
    { name: "Vehicle Theft", count: "1,020", trend: "-0.8%", status: "down" as const, icon: Car, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Card key={cat.name} hoverEffect className="p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-surface border border-border ${cat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <Badge variant={cat.status === "up" ? "danger" : "success"} size="sm">
                {cat.trend}
              </Badge>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-400 truncate">{cat.name}</div>
              <div className="text-lg font-bold text-white font-mono tracking-tight">{cat.count}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
