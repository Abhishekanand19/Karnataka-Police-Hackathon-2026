/**
 * CrimeLens AI - Evidence Validation Engine
 */

import { DataImportPipeline } from "../dataset/pipeline";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  verifiedFirsCount: number;
}

export class EvidenceValidator {
  private pipeline = DataImportPipeline.getInstance();

  public validateEvidence(citedFirIds: string[], districtName: string): ValidationResult {
    const firs = this.pipeline.getFIRs();
    const districts = this.pipeline.getDistricts();

    // Verify district
    const distMatch = districts.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
    if (!distMatch) {
      return { valid: false, reason: "Insufficient Evidence: Target district not found in Karnataka SCRB dataset.", verifiedFirsCount: 0 };
    }

    // Verify FIR citations
    const verifiedFirs = citedFirIds.filter((id) => firs.some((f) => f.id === id));
    if (verifiedFirs.length === 0) {
      return { valid: false, reason: "Insufficient Evidence: No verified FIR citations provided.", verifiedFirsCount: 0 };
    }

    return { valid: true, verifiedFirsCount: verifiedFirs.length };
  }
}
