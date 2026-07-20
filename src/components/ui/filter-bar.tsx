"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";

export interface FilterOption {
  id: string;
  label: string;
  category: string;
}

export interface FilterBarProps {
  filters: FilterOption[];
  selectedFilterIds: string[];
  onToggleFilter: (id: string) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  selectedFilterIds,
  onToggleFilter,
  onReset,
  className,
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-surface/50 border border-border rounded-xl ${className || ""}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mr-2 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span>Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {filters.map((filter) => {
          const isSelected = selectedFilterIds.includes(filter.id);
          return (
            <Chip
              key={filter.id}
              label={filter.label}
              active={isSelected}
              onClick={() => onToggleFilter(filter.id)}
            />
          );
        })}
      </div>

      {onReset && selectedFilterIds.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onReset} icon={<RotateCcw className="w-3 h-3" />}>
          Reset
        </Button>
      )}
    </div>
  );
};
