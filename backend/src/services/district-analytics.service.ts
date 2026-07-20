import { DataImportPipeline } from "../dataset/pipeline";

export class DistrictAnalyticsService {
  private pipeline = DataImportPipeline.getInstance();

  public getDistrictAnalytics() {
    const districts = this.pipeline.getDistricts();
    const firs = this.pipeline.getFIRs();

    return districts.map((dist) => {
      const distFirs = firs.filter((f) => f.districtId === dist.id);
      const totalCrimes = distFirs.length;
      const closed = distFirs.filter((f) => f.status === "Chargesheet Submitted").length;
      const clearanceRate = totalCrimes > 0 ? ((closed / totalCrimes) * 100).toFixed(1) + "%" : "0%";
      const density = ((totalCrimes / dist.population) * 100000).toFixed(2);

      let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";
      let riskScore = 35;
      if (totalCrimes >= 3) {
        riskLevel = "Critical";
        riskScore = 89;
      } else if (totalCrimes >= 1) {
        riskLevel = "Medium";
        riskScore = 62;
      }

      return {
        districtId: dist.id,
        districtName: dist.name,
        code: dist.code,
        population: dist.population,
        totalCrimes,
        solvedCases: closed,
        clearanceRate,
        crimeDensityPer100k: parseFloat(density),
        riskScore,
        riskLevel,
      };
    });
  }
}
