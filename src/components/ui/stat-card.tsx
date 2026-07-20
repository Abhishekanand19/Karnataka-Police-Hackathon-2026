"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  description,
  icon,
  className,
}) => {
  return (
    <Card hoverEffect className={cn("flex flex-col justify-between", className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-surface border border-border text-primary shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {trend.direction === "up" && (
              <span className="flex items-center gap-0.5 text-semantic-danger font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +{trend.value}
              </span>
            )}
            {trend.direction === "down" && (
              <span className="flex items-center gap-0.5 text-semantic-success font-medium">
                <TrendingDown className="w-3.5 h-3.5" /> -{trend.value}
              </span>
            )}
            {trend.direction === "neutral" && (
              <span className="flex items-center gap-0.5 text-gray-400 font-medium">
                <Minus className="w-3.5 h-3.5" /> {trend.value}
              </span>
            )}
            {trend.label && <span className="text-gray-400">{trend.label}</span>}
          </div>
        )}

        {description && !trend && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
};
