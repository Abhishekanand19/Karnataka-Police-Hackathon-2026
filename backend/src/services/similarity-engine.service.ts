import { DataImportPipeline } from "../dataset/pipeline";

export class SimilarityEngineService {
  private pipeline = DataImportPipeline.getInstance();

  public calculateSimilarity(targetCaseId: string) {
    const firs = this.pipeline.getFIRs();
    const target = firs.find((f) => f.id === targetCaseId) || firs[0];

    return firs
      .filter((f) => f.id !== target.id)
      .map((f) => {
        let score = 0;
        if (f.crimeCategory === target.crimeCategory) score += 40;
        if (f.modusOperandi === target.modusOperandi) score += 35;
        if (f.districtId === target.districtId) score += 25;

        return {
          caseId: f.id,
          title: `${f.crimeCategory} at ${f.policeStationName}`,
          similarityScore: score,
          matchingFactors: [
            f.crimeCategory === target.crimeCategory ? "Matching Crime Category" : null,
            f.modusOperandi === target.modusOperandi ? "Identical Modus Operandi" : null,
            f.districtId === target.districtId ? "Same District Jurisdiction" : null,
          ].filter(Boolean),
        };
      });
  }
}
