import React from "react";
import { cn } from "@/lib/utils";

export interface TableWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-card border border-card-border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      <table className="w-full text-left text-sm text-gray-200">{children}</table>
    </div>
  );
};

export const TableHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <thead className={cn("bg-surface/80 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-border", className)}>{children}</thead>;

export const TableBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <tbody className={cn("divide-y divide-border/40", className)}>{children}</tbody>;

export const TableRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={cn("hover:bg-surface/40 transition-colors", className)}>{children}</tr>;

export const TableHead = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <th className={cn("px-4 py-3.5", className)}>{children}</th>;

export const TableCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <td className={cn("px-4 py-3.5 text-xs text-gray-300", className)}>{children}</td>;
