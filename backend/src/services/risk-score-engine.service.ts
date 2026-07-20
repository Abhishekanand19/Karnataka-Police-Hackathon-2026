export class RiskScoreEngineService {
  public calculateRiskScore(factors: {
    crimeSeverity: number;
    repeatSuspectsCount: number;
    crossDistrictLinks: number;
    financialLossAmount: number;
  }): { score: number; level: "Low" | "Medium" | "High" | "Critical" } {
    let score =
      factors.crimeSeverity * 0.4 +
      factors.repeatSuspectsCount * 15 +
      factors.crossDistrictLinks * 10 +
      Math.min(factors.financialLossAmount / 10000, 25);

    score = Math.min(Math.max(Math.round(score), 10), 99);

    let level: "Low" | "Medium" | "High" | "Critical" = "Low";
    if (score >= 85) level = "Critical";
    else if (score >= 70) level = "High";
    else if (score >= 50) level = "Medium";

    return { score, level };
  }
}
