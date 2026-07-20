/**
 * CrimeLens AI - Response Formatter
 */

import { Citation } from "./citation-engine";

export interface AIResponsePayload {
  summary: string;
  evidence: {
    citedFirs: { id: string; title: string; district: string; risk: string }[];
    primaryMO: string;
    associatedVehicles: string[];
  };
  reasoning: string;
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  relatedCases: string[];
  timeline: { stepNumber: number; title: string }[];
  suggestedNextActions: string[];
  citations: Citation[];
}

export class ResponseFormatter {
  public formatResponse(
    summary: string,
    evidence: any,
    reasoning: string,
    confidenceLevel: "High" | "Medium" | "Low",
    confidenceScore: number,
    citations: Citation[]
  ): AIResponsePayload {
    return {
      summary,
      evidence,
      reasoning,
      confidence: confidenceLevel,
      confidenceScore,
      relatedCases: evidence.citedFirs.map((f: any) => f.id),
      timeline: [
        { stepNumber: 1, title: "Complaint Filed" },
        { stepNumber: 2, title: "FIR Registered" },
        { stepNumber: 3, title: "Evidence Collected" },
      ],
      suggestedNextActions: [
        "Explain network relationships for Suspect #A-901",
        "Show repeat offenders in Indiranagar PS",
        "Compare Mysuru vs. Bengaluru Urban clearance rate",
      ],
      citations,
    };
  }
}
