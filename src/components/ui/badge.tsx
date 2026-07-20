import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral" | "accent";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-surface border-border text-gray-300",
    success: "bg-semantic-success/15 border-semantic-success/30 text-semantic-success",
    warning: "bg-semantic-warning/15 border-semantic-warning/30 text-semantic-warning",
    danger: "bg-semantic-danger/15 border-semantic-danger/30 text-semantic-danger",
    info: "bg-semantic-info/15 border-semantic-info/30 text-semantic-info",
    neutral: "bg-surface border-border text-semantic-neutral",
    accent: "bg-accent/15 border-accent/30 text-accent",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded",
    md: "px-2.5 py-1 text-xs font-medium rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-solid shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
