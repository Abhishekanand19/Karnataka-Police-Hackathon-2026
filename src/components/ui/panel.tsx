import React from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  glass?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  action,
  children,
  glass = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-card border bg-card border-card-border p-5 text-gray-100 shadow-sm flex flex-col",
        glass && "glass-panel",
        className
      )}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
