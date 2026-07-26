"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Officer, FIR, Suspect, Evidence, TimelineEvent, MOCK_DB } from "@/lib/mock-database";

export interface ActiveCaseContext {
  fir: FIR;
  suspects: Suspect[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  victims: typeof MOCK_DB.victims;
  vehicles: typeof MOCK_DB.vehicles;
  phones: typeof MOCK_DB.phoneRecords;
  accounts: typeof MOCK_DB.bankAccounts;
  relatedFirs: FIR[];
}

export interface InvestigationContextType {
  officer: Officer | null;
  login: (badgeId: string, password?: string) => boolean;
  logout: () => void;
  activeInvestigation: {
    type: string;
    entity: string;
    entityId: string;
    officerSession: string;
    timestamp: string;
  } | null;
  activeFir: FIR | null;
  caseContext: ActiveCaseContext | null;
  setInvestigation: (type: string, entity: string, entityId: string) => void;
  mounted: boolean;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export function InvestigationProvider({ children }: { children: React.ReactNode }) {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [activeInvestigation, setActiveInvestigation] = useState<InvestigationContextType["activeInvestigation"]>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const activeFir = activeInvestigation?.type === "FIR"
    ? MOCK_DB.firs.find(fir => fir.firNumber === activeInvestigation.entityId) || null
    : null;
  const caseContext: ActiveCaseContext | null = activeFir ? {
    fir: activeFir,
    suspects: MOCK_DB.suspects.filter(item => activeFir.linkedSuspects.includes(item.id)),
    evidence: MOCK_DB.evidence.filter(item => item.firId === activeFir.firNumber),
    timeline: MOCK_DB.timelineEvents.filter(item => item.firId === activeFir.firNumber).sort((a, b) => a.stepNumber - b.stepNumber),
    victims: MOCK_DB.victims.filter(item => item.firId === activeFir.firNumber),
    vehicles: MOCK_DB.vehicles.filter(item => item.firId === activeFir.firNumber),
    phones: MOCK_DB.phoneRecords.filter(item => item.firId === activeFir.firNumber),
    accounts: MOCK_DB.bankAccounts.filter(item => item.firId === activeFir.firNumber),
    relatedFirs: MOCK_DB.firs.filter(item => item.id !== activeFir.id && (item.category === activeFir.category || item.district === activeFir.district || item.linkedSuspects.some(id => activeFir.linkedSuspects.includes(id)))),
  } : null;

  useEffect(() => {
    // Load from sessionStorage on mount
    const storedOfficer = sessionStorage.getItem("crimeLensOfficer");
    if (storedOfficer) {
      setOfficer(JSON.parse(storedOfficer));
    }
    const storedInv = sessionStorage.getItem("crimeLensInvestigation");
    if (storedInv) {
      setActiveInvestigation(JSON.parse(storedInv));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let currentPath = pathname;
    if (currentPath === "/index.html") {
      router.replace("/");
      return;
    }
    
    const isLogin = currentPath.startsWith("/login");
    
    // Auth Guarding
    if (!officer && !isLogin) {
      router.replace("/login");
    } else if (officer && isLogin) {
      router.replace("/workspace");
    }
  }, [officer, pathname, mounted, router]);

  const login = (badgeId: string, password?: string) => {
    const cleanId = badgeId.trim().toUpperCase();
    const foundOfficer = MOCK_DB.officers.find(
      o => o.badgeId.toUpperCase() === cleanId || o.badgeId.replace("KSP-", "") === cleanId
    ) || MOCK_DB.officers[0];

    if (foundOfficer && cleanId.length > 0) {
      setOfficer(foundOfficer);
      sessionStorage.setItem("crimeLensOfficer", JSON.stringify(foundOfficer));
      router.replace("/workspace");
      return true;
    }
    return false;
  };

  const logout = () => {
    setOfficer(null);
    setActiveInvestigation(null);
    sessionStorage.removeItem("crimeLensOfficer");
    sessionStorage.removeItem("crimeLensInvestigation");
    router.replace("/login");
  };

  const setInvestigation = (type: string, entity: string, entityId: string) => {
    if (!officer) return;
    
    const newInv = {
      type,
      entity,
      entityId,
      officerSession: officer.badgeId,
      timestamp: new Date().toISOString()
    };
    
    setActiveInvestigation(newInv);
    sessionStorage.setItem("crimeLensInvestigation", JSON.stringify(newInv));
    router.push("/");
  };

  return (
    <InvestigationContext.Provider value={{ officer, login, logout, activeInvestigation, activeFir, caseContext, setInvestigation, mounted }}>
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const context = useContext(InvestigationContext);
  if (context === undefined) {
    throw new Error("useInvestigation must be used within an InvestigationProvider");
  }
  return context;
}
