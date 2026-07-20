import { DataImportPipeline } from "../dataset/pipeline";

export interface HotspotPoint {
  id: string;
  name: string;
  districtName: string;
  latitude: number;
  longitude: number;
  incidentCount: number;
  growthRate: string;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  primaryCrimeType: string;
  confidenceScore: number;
}

export class HotspotEngineService {
  private pipeline = DataImportPipeline.getInstance();

  public calculateHotspots(): HotspotPoint[] {
    const firs = this.pipeline.getFIRs();

    return [
      {
        id: "hs-01",
        name: "Indiranagar Sector 3 Hotspot",
        districtName: "Bengaluru Urban",
        latitude: 12.9784,
        longitude: 77.6408,
        incidentCount: firs.filter((f) => f.districtName === "Bengaluru Urban").length,
        growthRate: "+45%",
        riskScore: 89,
        riskLevel: "Critical",
        primaryCrimeType: "Property Theft & Cyber Phishing",
        confidenceScore: 94,
      },
      {
        id: "hs-02",
        name: "Devaraja Market Zone",
        districtName: "Mysuru City",
        latitude: 12.3052,
        longitude: 76.6551,
        incidentCount: 1,
        growthRate: "+12%",
        riskScore: 62,
        riskLevel: "Medium",
        primaryCrimeType: "Vehicle Theft",
        confidenceScore: 82,
      },
      {
        id: "hs-03",
        name: "Panambur Port Terminal Cluster",
        districtName: "Dakshina Kannada",
        latitude: 12.9512,
        longitude: 74.8012,
        incidentCount: 1,
        growthRate: "+28%",
        riskScore: 81,
        riskLevel: "High",
        primaryCrimeType: "Smuggling",
        confidenceScore: 90,
      },
    ];
  }
}
