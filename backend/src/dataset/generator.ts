/**
 * CrimeLens AI - Karnataka SCRB Synthetic Dataset Generator
 */

export interface DistrictRecord {
  id: string;
  name: string;
  code: string;
  population: number;
  latitude: number;
  longitude: number;
  policeStationCount: number;
}

export interface PoliceStationRecord {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  sector: string;
  jurisdictionRadiusKm: number;
  officerInCharge: string;
}

export interface FIRRecord {
  id: string;
  firNumber: string;
  districtId: string;
  districtName: string;
  policeStationId: string;
  policeStationName: string;
  crimeCategory: string;
  status: "Under Investigation" | "Suspect Arrested" | "Chargesheet Submitted" | "Closed";
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  modusOperandi: string;
  victimName: string;
  suspectId?: string;
  suspectName?: string;
  vehicleReg?: string;
  phoneNumber?: string;
  bankAccount?: string;
  weaponUsed?: string;
}

export interface AccusedRecord {
  id: string;
  suspectNumber: string;
  name: string;
  alias?: string;
  age: number;
  gender: string;
  primaryDistrict: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  repeatOffenderScore: number;
  associatedFirIds: string[];
  associatedVehicles: string[];
  associatedPhones: string[];
  primaryMO: string;
}

export const KARNATAKA_DISTRICTS: DistrictRecord[] = [
  { id: "dist-blr-u", name: "Bengaluru Urban", code: "BLR-U", population: 13200000, latitude: 12.9716, longitude: 77.5946, policeStationCount: 108 },
  { id: "dist-mys", name: "Mysuru City", code: "MYS", population: 1250000, latitude: 12.2958, longitude: 76.6394, policeStationCount: 24 },
  { id: "dist-dk", name: "Dakshina Kannada", code: "DK", population: 2080000, latitude: 12.9141, longitude: 74.856, policeStationCount: 32 },
  { id: "dist-bel", name: "Belagavi", code: "BEL", population: 4780000, latitude: 15.8497, longitude: 74.4977, policeStationCount: 38 },
  { id: "dist-dwd", name: "Hubballi-Dharwad", code: "DWD", population: 1850000, latitude: 15.3647, longitude: 75.124, policeStationCount: 28 },
  { id: "dist-klb", name: "Kalaburagi", code: "KLB", population: 2560000, latitude: 17.3297, longitude: 76.8343, policeStationCount: 22 },
  { id: "dist-bal", name: "Ballari", code: "BAL", population: 1400000, latitude: 15.1394, longitude: 76.9214, policeStationCount: 18 },
  { id: "dist-svm", name: "Shivamogga", code: "SVM", population: 1750000, latitude: 13.9299, longitude: 75.5681, policeStationCount: 20 },
  { id: "dist-tum", name: "Tumakuru", code: "TUM", population: 2670000, latitude: 13.3379, longitude: 77.1173, policeStationCount: 26 },
  { id: "dist-vjp", name: "Vijayapura", code: "VJP", population: 2170000, latitude: 16.8302, longitude: 75.71, policeStationCount: 19 },
  { id: "dist-[#11]", name: "Udupi", code: "UDP", population: 1180000, latitude: 13.3409, longitude: 74.7421, policeStationCount: 16 },
  { id: "dist-[#12]", name: "Davanagere", code: "DVG", population: 1940000, latitude: 14.4644, longitude: 75.9218, policeStationCount: 18 },
];

export function generateSyntheticDataset() {
  const policeStations: PoliceStationRecord[] = [
    { id: "ps-hsr", name: "HSR Layout PS", districtId: "dist-blr-u", districtName: "Bengaluru Urban", sector: "Sector 2 Cyber", jurisdictionRadiusKm: 6.5, officerInCharge: "Inspector V. Patil" },
    { id: "ps-ind", name: "Indiranagar PS", districtId: "dist-blr-u", districtName: "Bengaluru Urban", sector: "Sector 3 Burglary", jurisdictionRadiusKm: 5.2, officerInCharge: "Sub-Inspector M. Nayak" },
    { id: "ps-dev", name: "Devaraja PS", districtId: "dist-mys", districtName: "Mysuru City", sector: "Central Sector", jurisdictionRadiusKm: 8.0, officerInCharge: "Inspector R. Gowda" },
    { id: "ps-pan", name: "Panambur PS", districtId: "dist-dk", districtName: "Dakshina Kannada", sector: "Port Zone", jurisdictionRadiusKm: 12.0, officerInCharge: "Inspector K. Rai" },
  ];

  const accusedList: AccusedRecord[] = [
    {
      id: "acc-901",
      suspectNumber: "A-901",
      name: "Rajesh Kumar",
      alias: "Phisher King",
      age: 34,
      gender: "Male",
      primaryDistrict: "Bengaluru Urban",
      riskLevel: "Critical",
      repeatOffenderScore: 92,
      associatedFirIds: ["FIR-2026-00491", "FIR-2026-00488"],
      associatedVehicles: ["KA-01-MJ-8910"],
      associatedPhones: ["+91 98450 11029"],
      primaryMO: "Social Engineering OTP Phishing",
    },
    {
      id: "acc-402",
      suspectNumber: "A-402",
      name: "Suresh V.",
      alias: "Spider",
      age: 29,
      gender: "Male",
      primaryDistrict: "Bengaluru Urban",
      riskLevel: "High",
      repeatOffenderScore: 78,
      associatedFirIds: ["FIR-2026-00488", "FIR-2026-00485"],
      associatedVehicles: ["KA-01-MJ-8910"],
      associatedPhones: ["+91 97400 88201"],
      primaryMO: "Crowbar Lock Bypassing",
    },
    {
      id: "acc-108",
      suspectNumber: "A-108",
      name: "Ibrahim K.",
      alias: "Coastal Boss",
      age: 41,
      gender: "Male",
      primaryDistrict: "Dakshina Kannada",
      riskLevel: "High",
      repeatOffenderScore: 81,
      associatedFirIds: ["FIR-2026-00388"],
      associatedVehicles: ["KA-19-P-4410"],
      associatedPhones: ["+91 97400 88201"],
      primaryMO: "Contraband Port Smuggling",
    },
  ];

  const firList: FIRRecord[] = [
    {
      id: "FIR-2026-00491",
      firNumber: "00491/2026",
      districtId: "dist-blr-u",
      districtName: "Bengaluru Urban",
      policeStationId: "ps-hsr",
      policeStationName: "HSR Layout PS",
      crimeCategory: "Cyber Crime",
      status: "Chargesheet Submitted",
      riskScore: 89,
      riskLevel: "Critical",
      date: "2026-07-14",
      time: "10:15:00",
      latitude: 12.9116,
      longitude: 77.6412,
      modusOperandi: "Social Engineering OTP Phishing",
      victimName: "Anand Sharma",
      suspectId: "acc-901",
      suspectName: "Rajesh Kumar",
      vehicleReg: "KA-01-MJ-8910",
      phoneNumber: "+91 98450 11029",
      bankAccount: "948102841",
      weaponUsed: "Cyber Toolkit",
    },
    {
      id: "FIR-2026-00488",
      firNumber: "00488/2026",
      districtId: "dist-blr-u",
      districtName: "Bengaluru Urban",
      policeStationId: "ps-ind",
      policeStationName: "Indiranagar PS",
      crimeCategory: "Property Theft",
      status: "Suspect Arrested",
      riskScore: 78,
      riskLevel: "High",
      date: "2026-07-12",
      time: "02:30:00",
      latitude: 12.9784,
      longitude: 77.6408,
      modusOperandi: "Crowbar Lock Bypassing",
      victimName: "Priya Nair",
      suspectId: "acc-402",
      suspectName: "Suresh V.",
      vehicleReg: "KA-01-MJ-8910",
      phoneNumber: "+91 97400 88201",
      weaponUsed: "Crowbar",
    },
    {
      id: "FIR-2026-00485",
      firNumber: "00485/2026",
      districtId: "dist-blr-u",
      districtName: "Bengaluru Urban",
      policeStationId: "ps-ind",
      policeStationName: "Indiranagar PS",
      crimeCategory: "Property Theft",
      status: "Under Investigation",
      riskScore: 74,
      riskLevel: "High",
      date: "2026-07-10",
      time: "03:15:00",
      latitude: 12.9755,
      longitude: 77.6432,
      modusOperandi: "Crowbar Lock Bypassing",
      victimName: "Commercial Office Complex",
      suspectId: "acc-402",
      suspectName: "Suresh V.",
      weaponUsed: "Crowbar",
    },
    {
      id: "FIR-2026-00412",
      firNumber: "00412/2026",
      districtId: "dist-mys",
      districtName: "Mysuru City",
      policeStationId: "ps-dev",
      policeStationName: "Devaraja PS",
      crimeCategory: "Vehicle Theft",
      status: "Under Investigation",
      riskScore: 62,
      riskLevel: "Medium",
      date: "2026-07-08",
      time: "18:45:00",
      latitude: 12.3052,
      longitude: 76.6551,
      modusOperandi: "Ignition Bypass Key Duplicate",
      victimName: "Siddharamaiah M.",
      vehicleReg: "KA-09-EA-1204",
    },
    {
      id: "FIR-2026-00388",
      firNumber: "00388/2026",
      districtId: "dist-dk",
      districtName: "Dakshina Kannada",
      policeStationId: "ps-pan",
      policeStationName: "Panambur PS",
      crimeCategory: "Smuggling",
      status: "Suspect Arrested",
      riskScore: 81,
      riskLevel: "High",
      date: "2026-07-05",
      time: "23:10:00",
      latitude: 12.9512,
      longitude: 74.8012,
      modusOperandi: "Contraband Port Smuggling",
      victimName: "Customs Department",
      suspectId: "acc-108",
      suspectName: "Ibrahim K.",
      vehicleReg: "KA-19-P-4410",
      phoneNumber: "+91 97400 88201",
    },
  ];

  return {
    districts: KARNATAKA_DISTRICTS,
    policeStations,
    accused: accusedList,
    firs: firList,
  };
}
