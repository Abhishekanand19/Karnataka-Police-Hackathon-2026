import { DataImportPipeline } from "../dataset/pipeline";

export class NetworkBuilderService {
  private pipeline = DataImportPipeline.getInstance();

  public buildNetworkGraph(targetCaseId?: string) {
    const firs = this.pipeline.getFIRs();
    const activeFir = targetCaseId ? firs.find((f) => f.id === targetCaseId) : firs[0];

    const nodes = [
      { id: "node-fir-491", name: activeFir?.id || "FIR-2026-00491", type: "Case", risk: "Critical", riskScore: 89, district: "Bengaluru Urban", category: "Cyber Crime", x: 450, y: 280 },
      { id: "node-acc-901", name: "Rajesh Kumar (A-901)", type: "Accused", risk: "Critical", riskScore: 92, district: "Bengaluru Urban", category: "Cyber Crime", x: 280, y: 180 },
      { id: "node-acc-402", name: "Suresh 'Spider' V.", type: "Accused", risk: "High", riskScore: 78, district: "Bengaluru Urban", category: "Property Theft", x: 620, y: 160 },
      { id: "node-phone-01", name: "+91 98450 11029", type: "PhoneNumber", risk: "High", riskScore: 84, district: "Bengaluru Urban", category: "Telecom", x: 480, y: 110 },
      { id: "node-bank-01", name: "A/C 948102841", type: "BankAccount", risk: "Critical", riskScore: 88, district: "Bengaluru Urban", category: "Financial", x: 260, y: 420 },
      { id: "node-veh-01", name: "KA-01-MJ-8910", type: "Vehicle", risk: "High", riskScore: 76, district: "Bengaluru Urban", category: "Transport", x: 680, y: 340 },
    ];

    const edges = [
      { id: "edge-1", source: "node-acc-901", target: "node-fir-491", label: "Prime Accused In", strength: "Critical" },
      { id: "edge-4", source: "node-acc-901", target: "node-phone-01", label: "Registered Phone", strength: "Critical" },
      { id: "edge-5", source: "node-acc-901", target: "node-bank-01", label: "Transferred Funds", strength: "Critical" },
      { id: "edge-6", source: "node-acc-402", target: "node-fir-491", label: "Associate Link", strength: "Strong" },
      { id: "edge-7", source: "node-acc-402", target: "node-veh-01", label: "Used Vehicle", strength: "Strong" },
    ];

    return {
      nodesCount: nodes.length,
      edgesCount: edges.length,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
  }
}
