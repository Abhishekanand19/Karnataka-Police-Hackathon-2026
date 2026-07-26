import { 
  CheckCircle2, CreditCard, Crosshair, MapPin, Search, Users, AlertTriangle, Activity, Briefcase
} from "lucide-react";

// ============================================================================
// CORE DATA INTERFACES
// ============================================================================

export interface Officer {
  badgeId: string;
  name: string;
  role: string;
  district: string;
  station: string;
}

export interface Suspect {
  id: string;
  name: string;
  alias?: string;
  type: "Primary Target" | "Known Associate" | "Mule" | "Absconder";
  riskScore: number;
  status: "Active" | "Arrested" | "Bailed" | "Absconding";
  linkedFIRs: string[];
  imageUrl?: string;
}

export interface FIR {
  id: string;
  firNumber: string;
  date: string;
  category: string;
  station: string;
  district: string;
  status: "Under Investigation" | "Chargesheet Submitted" | "Closed" | "Suspect Arrested";
  description: string;
  riskScore: number;
  linkedSuspects: string[];
}

export interface Evidence {
  id: string;
  title: string;
  type: string;
  date: string;
  fileSize: string;
  firId: string;
}

export interface TimelineEvent {
  id: string;
  stepNumber: number;
  date: string;
  time: string;
  title: string;
  officer: string;
  location: string;
  summary: string;
  category: "Evidence" | "Investigation" | "Arrest" | "Report" | "FIR" | "Statement" | "Suspect" | "Financial" | "Network" | "Chargesheet" | "Court";
  icon: any; // Lucide icon
  evidenceCount?: number;
  firId: string;
  connectedEntities?: string[];
  attachments?: string[];
  notes?: { id: string; author: string; content: string; date: string }[];
}

export interface Hotspot {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  risk: "Critical" | "High" | "Medium" | "Low";
  riskScore: number;
  cases: number;
  policeStation: string;
  topCrime: string;
  trend: string;
  repeatOffenders: number;
  openCases: number;
  solvedRate: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: "Case" | "Accused" | "Victim" | "PoliceStation" | "District" | "Location" | "Court" | "CrimeCategory" | "Vehicle" | "PhoneNumber" | "BankAccount" | "Weapon" | "ModusOperandi" | "Person" | "Phone";
  risk?: "Critical" | "High" | "Medium" | "Low";
  riskScore?: number;
  district?: string;
  category?: string;
  x: number;
  y: number;
  details?: string;
  relationshipsCount?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: "Weak" | "Medium" | "Strong" | "Critical";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "insight" | "event" | "action";
  timestamp: string;
  read: boolean;
}

export interface DashboardStat {
  district: string;
  openCases: number;
  arrests: number;
  riskScore: number;
  trend: number;
}

export interface ActivityFeedItem {
  id: string;
  officer: string;
  action: string;
  target: string;
  time: string;
  firId: string;
}

export interface ActionQueueItem {
  id: string;
  title: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  firId: string;
}

// ============================================================================
// CENTRALIZED MOCK DATABASE (SCRB SYNTHETIC DATASET ENGINE)
// ============================================================================

import { SYNTHETIC_SCRB_DB } from "./synthetic-scrb-db";

export const MOCK_DB = {
  officers: SYNTHETIC_SCRB_DB.officers,
  firs: SYNTHETIC_SCRB_DB.firs,
  suspects: SYNTHETIC_SCRB_DB.suspects,
  victims: SYNTHETIC_SCRB_DB.victims,
  vehicles: SYNTHETIC_SCRB_DB.vehicles,
  phoneRecords: SYNTHETIC_SCRB_DB.phoneRecords,
  bankAccounts: SYNTHETIC_SCRB_DB.bankAccounts,
  evidence: SYNTHETIC_SCRB_DB.evidenceItems,
  timelineEvents: SYNTHETIC_SCRB_DB.timelineEvents,
  hotspots: SYNTHETIC_SCRB_DB.hotspots,

  networkNodes: [
    { id: "fir-001", name: "FIR-2026-00491", type: "Case", risk: "Critical", riskScore: 94, x: 400, y: 300, details: "Phishing Scam" },
    { id: "sus-001", name: "Rajesh Kumar", type: "Accused", risk: "Critical", riskScore: 92, x: 250, y: 180, details: "Primary Target" },
    { id: "sus-002", name: "Prakash Rao", type: "Accused", risk: "High", riskScore: 85, x: 550, y: 180, details: "Known Associate" },
    { id: "sus-005", name: "Anand Sharma", type: "Accused", risk: "Medium", riskScore: 65, x: 400, y: 450, details: "Mule" },
    { id: "ps-hsr", name: "HSR Layout PS", type: "PoliceStation", district: "Bengaluru City", x: 180, y: 360 },
    { id: "phone-001", name: "+91 9845012345", type: "Phone", x: 620, y: 340 }
  ] as NetworkNode[],

  networkEdges: [
    { id: "e1", source: "sus-001", target: "fir-001", label: "Accused", strength: "Critical" },
    { id: "e2", source: "sus-002", target: "fir-001", label: "Co-Accused", strength: "Strong" },
    { id: "e3", source: "sus-001", target: "phone-01", label: "Owner", strength: "Critical" },
    { id: "e4", source: "sus-002", target: "bank-01", label: "Operator", strength: "Critical" },
    { id: "e5", source: "phone-01", target: "bank-01", label: "Registered Number", strength: "Strong" },
    { id: "e6", source: "sus-001", target: "sus-006", label: "Known Associate", strength: "Medium" },
    { id: "e7", source: "sus-006", target: "fir-003", label: "Primary Accused", strength: "Critical" },
    { id: "e8", source: "sus-001", target: "veh-01", label: "Spotted In", strength: "Weak" },
    { id: "e9", source: "sus-006", target: "veh-01", label: "Registered Owner", strength: "Critical" }
  ] as NetworkEdge[],

  // 7. Global Notifications
  notifications: [
    { id: "not-01", title: "High-Risk Suspect Identified", message: "Rajesh Kumar matched via CCTV in HSR Layout.", type: "alert", timestamp: "5 mins ago", read: false },
    { id: "not-02", title: "New Evidence Uploaded", message: "CDR analysis completed for FIR-2026-00491.", type: "insight", timestamp: "32 mins ago", read: false },
    { id: "not-03", title: "Action Required", message: "Pending charge sheet submission for FIR-2026-00215.", type: "action", timestamp: "2 hours ago", read: true },
    { id: "not-04", title: "Statewide Crime Intelligence Sync", message: "SCRB Database synchronized 1,420 synthetic FIR records.", type: "event", timestamp: "4 hours ago", read: true }
  ] as Notification[],

  // 8. Dashboard Stats
  districtStats: [
    { district: "Bengaluru City", openCases: 1245, arrests: 342, riskScore: 92, trend: 5.4 },
    { district: "Bengaluru Rural", openCases: 412, arrests: 89, riskScore: 68, trend: -2.1 },
    { district: "Mysuru", openCases: 856, arrests: 215, riskScore: 84, trend: 1.2 },
    { district: "Mangaluru", openCases: 634, arrests: 178, riskScore: 79, trend: -0.5 },
    { district: "Hubballi-Dharwad", openCases: 592, arrests: 145, riskScore: 75, trend: 3.8 }
  ] as DashboardStat[],

  // 9. Dashboard Activity Feeds
  activityFeed: [
    { id: "act-01", officer: "Insp. M. Gowda", action: "uploaded Evidence", target: "CDR Report", time: "10m ago", firId: "fir-001" },
    { id: "act-02", officer: "Sub-Insp. R. Patil", action: "updated Status", target: "FIR-2026-00412", time: "45m ago", firId: "fir-002" },
    { id: "act-03", officer: "Analyst V. Sharma", action: "identified Suspect", target: "Syed Imran", time: "2h ago", firId: "fir-002" }
  ] as ActivityFeedItem[],

  emergingAlerts: [
    { id: "al-01", title: "Narcotics Cluster Detected", message: "3 new incidents near Koramangala college zone.", type: "Warning", time: "10m ago", firId: "fir-002" },
    { id: "al-02", title: "Fugitive Spotted", message: "ANPR camera flagged KA-01-MJ-1234 at Hosur Road Toll.", type: "Critical", time: "1h ago", firId: "fir-003" },
    { id: "al-03", title: "Cyber Fraud Spike", message: "12 identical phishing complaints in HSR Layout today.", type: "Alert", time: "3h ago", firId: "fir-001" }
  ],

  actionQueue: [
    { id: "aq-01", title: "Review CDR matches for FIR-2026-00491", deadline: "Today, 14:00", priority: "High", firId: "fir-001" },
    { id: "aq-02", title: "File Charge Sheet for Narcotics Case", deadline: "Tomorrow, 10:00", priority: "High", firId: "fir-002" },
    { id: "aq-03", title: "Approve Warrants for Extortion Ring", deadline: "24-Jul, 17:00", priority: "Medium", firId: "fir-003" }
  ] as ActionQueueItem[]
};
