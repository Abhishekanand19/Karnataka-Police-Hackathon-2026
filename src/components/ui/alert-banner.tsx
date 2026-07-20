import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";

export interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = "info",
  title,
  children,
  action,
  className,
  ...props
}) => {
  const variantConfig = {
    info: {
      bg: "bg-semantic-info/10 border-semantic-info/30 text-semantic-info",
      icon: Info,
    },
    warning: {
      bg: "bg-semantic-warning/10 border-semantic-warning/30 text-semantic-warning",
      icon: AlertTriangle,
    },
    danger: {
      bg: "bg-semantic-danger/10 border-semantic-danger/30 text-semantic-danger",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-semantic-success/10 border-semantic-success/30 text-semantic-success",
      icon: CheckCircle2,
    },
  };

  const current = variantConfig[variant];
  const IconComponent = current.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm text-sm",
        current.bg,
        className
      )}
      {...props}
    >
      <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-white mb-1">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90 text-gray-200">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
