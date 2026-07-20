"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const GlobalAlertBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className="relative overflow-hidden rounded-xl border border-semantic-warning/40 bg-gradient-to-r from-semantic-warning/15 via-surface to-semantic-danger/15 p-4 shadow-lg backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-semantic-warning/20 text-semantic-warning shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Statewide Operational Alert
                </span>
                <Badge variant="danger" size="sm">
                  Priority 1
                </Badge>
                <span className="text-[11px] font-mono text-gray-400">
                  Updated 15 mins ago • SCRB Ref #ALT-2026-904
                </span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed max-w-4xl">
                <strong className="text-semantic-warning">Bengaluru Urban (HSR Layout & Indiranagar PS):</strong> Multi-FIR cluster detected (+38% nighttime property theft surge). 4 linked incidents matching MO & shared vehicle registration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => alert("Redirecting to Spatial Hotspot Analysis...")}
            >
              Investigate Hotspot
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-card/60 transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
