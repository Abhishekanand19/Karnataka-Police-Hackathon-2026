import {
  Officer, Suspect, FIR, Evidence, TimelineEvent, Hotspot, NetworkNode, NetworkEdge
} from "./mock-database";
import {
  FileText, Shield, UserCheck, AlertTriangle, Activity, MapPin, CheckCircle2, Search, Briefcase, CreditCard, Phone, Truck, FileCode
} from "lucide-react";

export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: string;
  firId: string;
  district: string;
  phone: string;
  lossAmount?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  color: string;
  status: "Stolen" | "Seized" | "Suspect Vehicle" | "Tracked";
  firId: string;
  ownerName: string;
}

export interface PhoneRecord {
  id: string;
  phoneNumber: string;
  subscriberName: string;
  carrier: "Airtel" | "Jio" | "Vi" | "BSNL";
  callVolume: number;
  linkedSuspectId: string;
  firId: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  holderName: string;
  balance: string;
  status: "Frozen" | "Active" | "Under Audit";
  firId: string;
}

// Data pools for synthetic generation
const DISTRICTS = [
  { name: "Bengaluru City", stations: ["HSR Layout PS", "Indiranagar PS", "Peenya PS", "Koramangala PS", "Cyber Crime Cell", "Jayanagar PS", "Whitefield PS"] },
  { name: "Mysuru", stations: ["Devaraja PS", "Nazarbad PS", "Vidyaranyapuram PS", "Lashkar PS"] },
  { name: "Hubballi-Dharwad", stations: ["Suburban PS", "Town PS", "Gokul Road PS"] },
  { name: "Mangaluru", stations: ["Pandeshwar PS", "Urwa PS", "Kadri PS"] },
  { name: "Belagavi", stations: ["Khadak Galli PS", "Tilakwadi PS", "APMC PS"] },
  { name: "Kalaburagi", stations: ["Brahampur PS", "Station Bazar PS"] },
  { name: "Ballari", stations: ["Cowla Bazar PS", "Brucepet PS"] },
  { name: "Shivamogga", stations: ["Jayanagar PS", "Doddapete PS"] },
  { name: "Tumakuru", stations: ["Town PS", "Kyathsandra PS"] },
  { name: "Udupi", stations: ["Town PS", "Manipal PS"] }
];

const CATEGORIES = [
  "Cyber Fraud", "Organized Extortion", "Night Burglary", "Narcotics Trafficking",
  "Commercial Robbery", "High-Value Vehicle Theft", "Financial Embezzlement", "Armed Robbery", "Phishing Scam", "Land Scam"
];

const FIRST_NAMES = ["Ramesh", "Suresh", "Vikram", "Rajesh", "Anand", "Deepak", "Priya", "Kavita", "Mohammed", "Syed", "Praveen", "Ganesh", "Manjunath", "Basavaraj", "Sunil", "Vijay", "Kiran", "Arjun", "Karthik", "Siddharth"];
const LAST_NAMES = ["Kumar", "Patil", "Gowda", "Rao", "Hegde", "Shetty", "Reddy", "Nayak", "Khan", "Ahmed", "Deshmukh", "Joshi", "Bhat", "Kulkarni", "Chavhan", "Pawar", "Naik", "Swamy", "Moolya", "Poojary"];
const ALIASES = ["Vicky", "Blackie", "Chota Raju", "Doctor", "Don", "Phantom", "Cobra", "Boss", "Broker", "Mechanic", "Captain", "Hacker S", "Bull", "Goldie"];

// Seeded PRNG for consistent dataset generation
let seed = 42;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

// Generate SCRB Dataset
export function generateSCRBDataset() {
  // 1. Officers (120)
  const officers: Officer[] = [];
  let officerIdx = 101;

  // Primary fixed officers
  officers.push(
    { badgeId: "KSP-101", name: "Inspector V. Patil", role: "Inspector", district: "Bengaluru City", station: "HSR Layout PS" },
    { badgeId: "KSP-102", name: "Sub-Insp. R. Gowda", role: "Sub-Inspector", district: "Mysuru", station: "Devaraja PS" },
    { badgeId: "KSP-103", name: "Analyst K. Rao", role: "Cyber Analyst", district: "Bengaluru City", station: "Cyber Crime Cell" }
  );

  for (let i = 4; i <= 120; i++) {
    const distObj = randomItem(DISTRICTS);
    const fname = randomItem(FIRST_NAMES);
    const lname = randomItem(LAST_NAMES);
    const role = randomItem(["Inspector", "Sub-Inspector", "Assistant Sub-Inspector", "Cyber Specialist", "Crime Branch Officer"]);
    officers.push({
      badgeId: `KSP-${officerIdx++}`,
      name: `${role.startsWith("Sub") ? "Sub-Insp." : role.startsWith("Insp") ? "Insp." : "Officer"} ${fname.charAt(0)}. ${lname}`,
      role,
      district: distObj.name,
      station: randomItem(distObj.stations)
    });
  }

  // 2. Suspects (300)
  const suspects: Suspect[] = [];
  for (let i = 1; i <= 300; i++) {
    const fname = randomItem(FIRST_NAMES);
    const lname = randomItem(LAST_NAMES);
    const hasAlias = random() > 0.4;
    const status = randomItem(["Active", "Arrested", "Bailed", "Absconding"] as const);
    const type = randomItem(["Primary Target", "Known Associate", "Mule", "Absconder"] as const);
    suspects.push({
      id: `sus-${String(i).padStart(3, "0")}`,
      name: `${fname} ${lname}`,
      alias: hasAlias ? randomItem(ALIASES) : undefined,
      type,
      riskScore: randomInt(45, 99),
      status,
      linkedFIRs: [],
      imageUrl: undefined
    });
  }

  // 3. FIRs (500)
  const firs: FIR[] = [];
  const firCategories = CATEGORIES;
  
  // Specific flagship FIRs for key demo scenarios
  firs.push(
    {
      id: "fir-001", firNumber: "FIR-2026-00491", date: "2026-07-21",
      category: "Cyber Fraud", station: "HSR Layout PS", district: "Bengaluru City",
      status: "Under Investigation", description: "Multi-crore phishing syndicate targeting elderly citizens through fake banking apps and OTP spoofing.",
      riskScore: 94, linkedSuspects: ["sus-001", "sus-002", "sus-005", "sus-006"]
    },
    {
      id: "fir-002", firNumber: "FIR-2026-00488", date: "2026-07-19",
      category: "Night Burglary", station: "Indiranagar PS", district: "Bengaluru City",
      status: "Under Investigation", description: "Organized break-in at luxury jewelry showroom in Indiranagar 100ft Road.",
      riskScore: 78, linkedSuspects: ["sus-003", "sus-004"]
    },
    {
      id: "fir-003", firNumber: "FIR-2026-00472", date: "2026-07-15",
      category: "Organized Extortion", station: "Devaraja PS", district: "Mysuru",
      status: "Chargesheet Submitted", description: "Extortion ring demanding protection fees from Mysuru silk market merchants.",
      riskScore: 86, linkedSuspects: ["sus-001", "sus-006", "sus-007"]
    }
  );

  for (let i = 4; i <= 500; i++) {
    const distObj = randomItem(DISTRICTS);
    const numStr = String(i).padStart(3, "0");
    const firNum = `FIR-2026-00${numStr}`;
    const category = randomItem(firCategories);
    const station = randomItem(distObj.stations);
    const status = randomItem(["Under Investigation", "Chargesheet Submitted", "Closed", "Suspect Arrested"] as const);
    
    // Pick 1 to 4 random suspects to link
    const numLinked = randomInt(1, 3);
    const linkedSusIds: string[] = [];
    for (let k = 0; k < numLinked; k++) {
      const sus = randomItem(suspects);
      if (!linkedSusIds.includes(sus.id)) {
        linkedSusIds.push(sus.id);
        sus.linkedFIRs.push(firNum);
      }
    }

    firs.push({
      id: `fir-${numStr}`,
      firNumber: firNum,
      date: `2026-0${randomInt(1, 7)}-${String(randomInt(1, 28)).padStart(2, "0")}`,
      category,
      station,
      district: distObj.name,
      status,
      description: `Reported incident of ${category.toLowerCase()} registered at ${station}, ${distObj.name}. Involving suspect group operating across multiple sectors.`,
      riskScore: randomInt(35, 98),
      linkedSuspects: linkedSusIds
    });
  }

  // Ensure first FIRs link back to suspects correctly
  firs[0].linkedSuspects.forEach(sId => suspects.find(s => s.id === sId)?.linkedFIRs.push(firs[0].firNumber));
  firs[1].linkedSuspects.forEach(sId => suspects.find(s => s.id === sId)?.linkedFIRs.push(firs[1].firNumber));
  firs[2].linkedSuspects.forEach(sId => suspects.find(s => s.id === sId)?.linkedFIRs.push(firs[2].firNumber));

  // 4. Victims (200)
  const victims: Victim[] = [
    {
      id: "vic-001",
      name: "Somashekar Rao",
      age: 68,
      gender: "Male",
      firId: "FIR-2026-00491",
      district: "Bengaluru City",
      phone: "+91 9886011223",
      lossAmount: "₹45,00,000"
    }
  ];
  for (let i = 2; i <= 200; i++) {
    const fname = randomItem(FIRST_NAMES);
    const lname = randomItem(LAST_NAMES);
    const fir = randomItem(firs);
    victims.push({
      id: `vic-${String(i).padStart(3, "0")}`,
      name: `${fname} ${lname}`,
      age: randomInt(22, 75),
      gender: random() > 0.5 ? "Male" : "Female",
      firId: fir.firNumber,
      district: fir.district,
      phone: `+91 98${randomInt(10000000, 99999999)}`,
      lossAmount: `₹${(randomInt(10, 500) * 10000).toLocaleString("en-IN")}`
    });
  }

  // 5. Vehicles (150)
  const vehicles: Vehicle[] = [
    { id: "veh-001", plateNumber: "KA-01-MJ-1234", model: "Maruti Swift", color: "White", status: "Tracked", firId: "FIR-2026-00491", ownerName: "Rajesh Kumar" },
    { id: "veh-002", plateNumber: "KA-05-NB-9876", model: "Mahindra Thar", color: "Black", status: "Suspect Vehicle", firId: "FIR-2026-00491", ownerName: "Prakash Rao" }
  ];
  const vehicleModels = ["Toyota Fortuner", "Hyundai Creta", "Maruti Swift", "Mahindra Thar", "Honda City", "Yamaha R15", "KTM Duke", "Royal Enfield 350"];
  const vehicleColors = ["Black", "White", "Silver", "Dark Grey", "Navy Blue", "Red"];
  for (let i = 3; i <= 150; i++) {
    const fir = randomItem(firs);
    vehicles.push({
      id: `veh-${String(i).padStart(3, "0")}`,
      plateNumber: `KA-${String(randomInt(1, 55)).padStart(2, "0")}-${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}-${randomInt(1000, 9999)}`,
      model: randomItem(vehicleModels),
      color: randomItem(vehicleColors),
      status: randomItem(["Stolen", "Seized", "Suspect Vehicle", "Tracked"] as const),
      firId: fir.firNumber,
      ownerName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
    });
  }

  // 6. Phone Numbers (250)
  const phoneRecords: PhoneRecord[] = [
    { id: "phone-001", phoneNumber: "+91 9845012345", subscriberName: "Rajesh Kumar", carrier: "Airtel", callVolume: 3420, linkedSuspectId: "sus-001", firId: "FIR-2026-00491" },
    { id: "phone-002", phoneNumber: "+91 9845098765", subscriberName: "Prakash Rao", carrier: "Jio", callVolume: 1890, linkedSuspectId: "sus-002", firId: "FIR-2026-00491" },
    { id: "phone-003", phoneNumber: "+91 9731245678", subscriberName: "Anand Sharma", carrier: "Vi", callVolume: 920, linkedSuspectId: "sus-005", firId: "FIR-2026-00491" }
  ];
  for (let i = 4; i <= 250; i++) {
    const fir = randomItem(firs);
    const sus = randomItem(suspects);
    phoneRecords.push({
      id: `phone-${String(i).padStart(3, "0")}`,
      phoneNumber: `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
      subscriberName: sus.name,
      carrier: randomItem(["Airtel", "Jio", "Vi", "BSNL"] as const),
      callVolume: randomInt(120, 4800),
      linkedSuspectId: sus.id,
      firId: fir.firNumber
    });
  }

  // 7. Bank Accounts (150)
  const bankAccounts: BankAccount[] = [
    { id: "bank-001", accountNumber: "482910482910", bankName: "HDFC Bank", ifsc: "HDFC000123", holderName: "Anand Sharma", balance: "₹18,50,000", status: "Frozen", firId: "FIR-2026-00491" },
    { id: "bank-002", accountNumber: "910238491023", bankName: "State Bank of India", ifsc: "SBIN000456", holderName: "Rajesh Kumar", balance: "₹24,00,000", status: "Under Audit", firId: "FIR-2026-00491" },
    { id: "bank-003", accountNumber: "331198233119", bankName: "ICICI Bank", ifsc: "ICIC000789", holderName: "Prakash Rao", balance: "₹8,20,000", status: "Active", firId: "FIR-2026-00491" }
  ];
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Canara Bank", "Axis Bank", "Karnataka Bank"];
  for (let i = 4; i <= 150; i++) {
    const fir = randomItem(firs);
    const bank = randomItem(banks);
    bankAccounts.push({
      id: `bank-${String(i).padStart(3, "0")}`,
      accountNumber: `${randomInt(1000, 9999)}${randomInt(1000, 9999)}${randomInt(1000, 9999)}`,
      bankName: bank,
      ifsc: `${bank.slice(0, 4).toUpperCase()}000${randomInt(100, 999)}`,
      holderName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      balance: `₹${(randomInt(5, 250) * 10000).toLocaleString("en-IN")}`,
      status: randomItem(["Frozen", "Active", "Under Audit"] as const),
      firId: fir.firNumber
    });
  }

  // 8. Evidence Items (1,200)
  const evidenceItems: Evidence[] = [];
  const evidenceTypes = ["Call Detail Record (CDR)", "CCTV Footage MP4", "Seized Hard Drive", "Forensic Hash Log", "Bank Transaction Ledger", "Weapons Seizure Report", "IP CDR Audit"];
  for (let i = 1; i <= 1200; i++) {
    const fir = randomItem(firs);
    const type = randomItem(evidenceTypes);
    evidenceItems.push({
      id: `ev-${String(i).padStart(4, "0")}`,
      title: `${type} - ${fir.firNumber}`,
      type,
      date: fir.date,
      fileSize: `${(random() * 850 + 10).toFixed(1)} MB`,
      firId: fir.firNumber
    });
  }

  // 9. Timeline Events (3,000)
  const timelineEvents: TimelineEvent[] = [];
  const timelineCategories = ["FIR", "Evidence", "Investigation", "Statement", "Suspect", "Financial", "Network", "Arrest", "Report", "Chargesheet", "Court"] as const;
  
  let eventCounter = 1;
  firs.forEach(fir => {
    // Generate 6 chronological steps per FIR
    const steps = [
      { title: "FIR Registered", cat: "FIR", summary: `Official FIR ${fir.firNumber} lodged at ${fir.station}. Category: ${fir.category}.` },
      { title: "Crime Scene Inspection & Evidence Lock", cat: "Evidence", summary: `Forensic team gathered physical samples, digital logs, and CCTV evidence from ${fir.district}.` },
      { title: "CDR & Tower Dump Analysis", cat: "Financial", summary: `Telecom records cross-referenced. High-frequency caller nodes identified.` },
      { title: "Suspect Identity Matched", cat: "Suspect", summary: `Fingerprint and facial recognition matched known offender records in KSP SCRB Central database.` },
      { title: "Asset Freeze & Account Seizure", cat: "Financial", summary: `Issued Section 102 CrPC notices to bank branches. Mule accounts frozen.` },
      { title: "Chargesheet & Legal Filing", cat: "Chargesheet", summary: `Final investigation dossier and chargesheet submitted before Special Judicial Magistrate.` }
    ];

    steps.forEach((step, idx) => {
      timelineEvents.push({
        id: `evt-${String(eventCounter++).padStart(5, "0")}`,
        stepNumber: idx + 1,
        date: fir.date,
        time: `${String(randomInt(8, 22)).padStart(2, "0")}:${String(randomInt(10, 59)).padStart(2, "0")}`,
        title: step.title,
        officer: randomItem(officers).name,
        location: `${fir.station}, ${fir.district}`,
        summary: step.summary,
        category: step.cat as any,
        icon: FileText,
        evidenceCount: randomInt(1, 6),
        firId: fir.firNumber,
        connectedEntities: fir.linkedSuspects
      });
    });
  });

  // 10. Hotspots
  const hotspots: Hotspot[] = [
    { id: "hs-1", name: "HSR Layout Sector 2 Cyber Corridor", district: "Bengaluru City", lat: 12.9121, lng: 77.6446, risk: "Critical", riskScore: 94, cases: 1420, policeStation: "HSR Layout PS", topCrime: "Phishing & SIM Swap", trend: "+14%", repeatOffenders: 42, openCases: 118, solvedRate: "68%" },
    { id: "hs-2", name: "Indiranagar 100ft Commercial Belt", district: "Bengaluru City", lat: 12.9784, lng: 77.6408, risk: "High", riskScore: 78, cases: 890, policeStation: "Indiranagar PS", topCrime: "Night Burglary", trend: "-4%", repeatOffenders: 19, openCases: 64, solvedRate: "74%" },
    { id: "hs-3", name: "Devaraja Market & Silk Trade Ring", district: "Mysuru", lat: 12.3052, lng: 76.6552, risk: "High", riskScore: 86, cases: 620, policeStation: "Devaraja PS", topCrime: "Extortion Syndicates", trend: "+8%", repeatOffenders: 27, openCases: 49, solvedRate: "81%" },
    { id: "hs-4", name: "Peenya Industrial Zone Estate", district: "Bengaluru City", lat: 13.0323, lng: 77.5142, risk: "Medium", riskScore: 62, cases: 410, policeStation: "Peenya PS", topCrime: "Heavy Cargo Theft", trend: "-12%", repeatOffenders: 11, openCases: 28, solvedRate: "89%" },
    { id: "hs-5", name: "Hubballi Railway Station Outer Ring", district: "Hubballi-Dharwad", lat: 15.3524, lng: 75.1432, risk: "High", riskScore: 75, cases: 530, policeStation: "Suburban PS", topCrime: "Narcotics Distribution", trend: "+6%", repeatOffenders: 22, openCases: 37, solvedRate: "76%" },
    { id: "hs-6", name: "Mangaluru Port & Customs Dock", district: "Mangaluru", lat: 12.9141, lng: 74.8560, risk: "Critical", riskScore: 91, cases: 980, policeStation: "Pandeshwar PS", topCrime: "Gold & Contraband Smuggling", trend: "+19%", repeatOffenders: 38, openCases: 84, solvedRate: "71%" }
  ];

  return {
    officers,
    suspects,
    firs,
    victims,
    vehicles,
    phoneRecords,
    bankAccounts,
    evidenceItems,
    timelineEvents,
    hotspots
  };
}

export const SYNTHETIC_SCRB_DB = generateSCRBDataset();
