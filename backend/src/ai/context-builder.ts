/**
 * CrimeLens AI - Investigation Context Builder
 */

import { DataImportPipeline } from "../dataset/pipeline";
import { FIRRecord } from "../dataset/generator";

export interface InvestigationContext {
  activeCase?: FIRRecord;
  activeDistrictName: string;
  totalDistrictCrimes: number;
  districtRiskScore: number;
  citedFirIds: string[];
  timelineEventsCount: number;
  networkNodesCount: number;
  repeatOffendersCount: number;
}

export class InvestigationContextBuilder {
  private pipeline = DataImportPipeline.getInstance();

  public buildContext(caseId?: string, districtName: string = "Bengaluru Urban"): InvestigationContext {
    const firs = this.pipeline.getFIRs();
    const activeCase = caseId ? firs.find((f) => f.id === caseId) : firs[0];
    const districtFirs = firs.filter((f) => f.districtName === districtName);

    return {
      activeCase,
      activeDistrictName: districtName,
      totalDistrictCrimes: districtFirs.length,
      districtRiskScore: districtFirs.length >= 3 ? 89 : 62,
      citedFirIds: districtFirs.map((f) => f.id),
      timelineEventsCount: 7,
      networkNodesCount: 6,
      repeatOffendersCount: 2,
    };
  }
}
