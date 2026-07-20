import { DataImportPipeline } from "../dataset/pipeline";

export class RepeatOffenderService {
  private pipeline = DataImportPipeline.getInstance();

  public getRepeatOffenders() {
    const accused = this.pipeline.getAccused();
    return accused
      .filter((a) => a.associatedFirIds.length >= 2 || a.repeatOffenderScore >= 75)
      .map((a) => ({
        suspectId: a.id,
        suspectNumber: a.suspectNumber,
        name: a.name,
        alias: a.alias,
        primaryDistrict: a.primaryDistrict,
        riskLevel: a.riskLevel,
        repeatOffenderScore: a.repeatOffenderScore,
        firCount: a.associatedFirIds.length,
        primaryMO: a.primaryMO,
      }));
  }
}
