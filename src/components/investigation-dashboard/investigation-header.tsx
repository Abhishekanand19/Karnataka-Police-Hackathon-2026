"use client";

import React, { useState, useEffect } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { format } from "date-fns";
import { UserCheck, Briefcase, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const InvestigationHeader: React.FC = () => {
  const { officer, activeInvestigation } = useInvestigation();
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!officer || !activeInvestigation) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 border border-primary/40 rounded-xl text-primary">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Active {activeInvestigation.type}: {activeInvestigation.entityId}
            <Badge variant="danger" size="sm" className="animate-pulse">Live Command</Badge>
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> {officer.name} ({officer.badgeId}) • {officer.role}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-bold text-white font-mono">{format(time, "HH:mm IST")}</div>
          <div className="text-xs text-gray-400 font-medium">{format(time, "dd MMM yyyy")}</div>
        </div>
        <div className="h-10 w-px bg-border/60 hidden md:block" />
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-white flex items-center justify-end gap-1"><MapPin className="w-4 h-4 text-primary" /> {officer.district}</div>
          <div className="text-xs text-gray-400 font-medium">{officer.station}</div>
        </div>
      </div>
    </div>
  );
};
