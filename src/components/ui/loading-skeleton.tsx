import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "circle" | "table";
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = "card",
  count = 1,
  className,
}) => {
  const items = Array.from({ length: count });

  if (variant === "text") {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn("h-4 bg-gray-800/80 rounded animate-pulse w-full", className)}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div className="flex gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn("w-10 h-10 bg-gray-800/80 rounded-full animate-pulse", className)}
          />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-gray-800/60 rounded-lg animate-pulse w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <div
          key={i}
          className={cn("h-40 bg-gray-800/60 rounded-card border border-border/40 animate-pulse p-4 space-y-3", className)}
        >
          <div className="h-5 bg-gray-700/50 rounded w-1/3" />
          <div className="h-8 bg-gray-700/50 rounded w-2/3" />
          <div className="h-4 bg-gray-700/30 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
