import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "An unexpected error occurred while fetching information. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-semantic-danger/10 border border-semantic-danger/30 rounded-card my-4 ${className || ""}`}>
      <div className="p-3 bg-semantic-danger/20 rounded-full text-semantic-danger mb-3 shrink-0">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-xs text-gray-300 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
