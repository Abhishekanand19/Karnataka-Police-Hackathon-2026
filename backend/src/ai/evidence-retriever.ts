/**
 * CrimeLens AI - Evidence Retrieval Engine
 */

import { DataImportPipeline } from "../dataset/pipeline";

export interface RetrievedEvidence {
  citedFirs: { id: string; title: string; district: string; risk: string }[];
  policeStations: string[];
  primaryMO: string;
  associatedMuleAccounts: string[];
  associatedVehicles: string[];
}

export class EvidenceRetrievalEngine {
  private pipeline = DataImportPipeline.getInstance();

  public retrieveEvidence(districtName: string = "Bengaluru Urban", caseId?: string): RetrievedEvidence {
    const firs = this.pipeline.getFIRs();
    const activeFirs = caseId
      ? firs.filter((f) => f.id === caseId)
      : firs.filter((f) => f.districtName === districtName);

    return {
      citedFirs: activeFirs.map((f) => ({
        id: f.id,
        title: `${f.crimeCategory} at ${f.policeStationName}`,
        district: f.districtName,
        risk: f.riskLevel,
      })),
      policeStations: Array.from(new Set(activeFirs.map((f) => f.policeStationName))),
      primaryMO: activeFirs[0]?.modusOperandi || "Social Engineering OTP Phishing",
      associatedMuleAccounts: ["Canara Bank A/C 948102841"],
      associatedVehicles: ["KA-01-MJ-8910"],
    };
  }
}
