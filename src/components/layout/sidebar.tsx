"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  GitFork,
  Bot,
  History,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useInvestigation } from "@/providers/investigation-provider";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Hotspot Map", href: "/map/", icon: MapPin, badge: "Live" },
  { name: "Network Graph", href: "/network/", icon: GitFork },
  { name: "AI Copilot", href: "/copilot/", icon: Bot, badge: "AI" },
  { name: "Timeline Replay", href: "/timeline/", icon: History },
  { name: "Intelligence Reports", href: "/reports/", icon: FileText },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { officer, logout } = useInvestigation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative z-30 flex flex-col h-screen bg-surface border-r border-border select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 text-primary shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-base font-bold tracking-tight text-white leading-none">
                  CrimeLens<span className="text-primary">.AI</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                  Karnataka Police SCRB
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-card border border-transparent hover:border-border transition-colors shrink-0"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" || pathname === "/index.html"
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-card/60"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 shrink-0 transition-transform group-hover:scale-105",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === "AI" ? "accent" : "danger"}
                        size="sm"
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Footer & User Profile */}
      <div className="p-3 border-t border-border space-y-2">
        <Link
          href="/settings/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            pathname === "/settings/"
              ? "bg-card text-white border border-border"
              : "text-gray-400 hover:text-white hover:bg-card/50"
          )}
        >
          <Settings className="w-6 h-6 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-card/20 border border-card-border/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">{officer ? officer.name : "Guest"}</div>
                <div className="text-[10px] text-gray-400 truncate">{officer ? `${officer.role} • ${officer.district}` : "Not logged in"}</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout Session"
              className="p-1.5 rounded-lg text-gray-400 hover:text-semantic-danger hover:bg-semantic-danger/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {!collapsed && (
          <div className="px-2 pt-1 text-[10px] text-gray-500 font-mono text-center">
            CrimeLens v1.0 • KSP 2026
          </div>
        )}
      </div>
    </motion.aside>
  );
};
