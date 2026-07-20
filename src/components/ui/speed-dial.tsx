"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, GitFork, MapPin, Bot, FileText, Search } from "lucide-react";

export const SpeedDial: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const actions = [
    { label: "Start Investigation", icon: GitFork, path: "/network", color: "bg-primary text-white" },
    { label: "Open AI Copilot", icon: Bot, path: "/copilot", color: "bg-accent text-white" },
    { label: "View Crime Map", icon: MapPin, path: "/map", color: "bg-semantic-warning text-white" },
    { label: "Case Timeline Replay", icon: FileText, path: "/timeline", color: "bg-purple-600 text-white" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <AnimatePresence>
        {open && (
          <div className="flex flex-col items-end gap-2.5 mb-3">
            {actions.map((act, idx) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.label}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setOpen(false);
                    router.push(act.path);
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-card/90 border border-border text-white text-xs font-semibold shadow-xl backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                    {act.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 ${act.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
          open
            ? "bg-semantic-danger rotate-45 ring-4 ring-semantic-danger/40"
            : "bg-primary hover:bg-primary-hover ring-4 ring-primary/30"
        }`}
        title="Quick Operational Shortcuts"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
