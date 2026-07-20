"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onRemove,
  icon,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer select-none",
        active
          ? "bg-primary/20 border-primary text-primary"
          : "bg-surface border-border text-gray-300 hover:border-gray-500 hover:text-white",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-gray-700/50 p-0.5 rounded-full text-gray-400 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
