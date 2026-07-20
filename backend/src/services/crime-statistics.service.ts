import { DataImportPipeline } from "../dataset/pipeline";

export class CrimeStatisticsService {
  private pipeline = DataImportPipeline.getInstance();

  public getOverallStatistics() {
    const firs = this.pipeline.getFIRs();
    const totalCases = firs.length;
    const closedCases = firs.filter((f) => f.status === "Chargesheet Submitted" || f.status === "Closed").length;
    const openCases = totalCases - closedCases;
    const clearanceRate = totalCases > 0 ? ((closedCases / totalCases) * 100).toFixed(1) + "%" : "0%";

    const categoryCounts: Record<string, number> = {};
    firs.forEach((f) => {
      categoryCounts[f.crimeCategory] = (categoryCounts[f.crimeCategory] || 0) + 1;
    });

    return {
      totalCases,
      openCases,
      closedCases,
      clearanceRate,
      categoryCounts,
      timestamp: new Date().toISOString(),
    };
  }
}
