import React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from "lucide-react";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel;
  showIcon?: boolean;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  showIcon = true,
  score,
  className,
  ...props
}) => {
  const config = {
    Low: {
      bg: "bg-risk-low/15 border-risk-low/40 text-risk-low",
      icon: ShieldCheck,
    },
    Medium: {
      bg: "bg-risk-medium/15 border-risk-medium/40 text-risk-medium",
      icon: AlertTriangle,
    },
    High: {
      bg: "bg-risk-high/15 border-risk-high/40 text-risk-high",
      icon: ShieldAlert,
    },
    Critical: {
      bg: "bg-risk-critical/20 border-risk-critical/50 text-risk-critical animate-pulse",
      icon: Flame,
    },
  };

  const current = config[level] || config.Low;
  const IconComponent = current.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border uppercase tracking-wider",
        current.bg,
        className
      )}
      {...props}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>
        {level} {score !== undefined ? `(${score})` : ""}
      </span>
    </span>
  );
};
