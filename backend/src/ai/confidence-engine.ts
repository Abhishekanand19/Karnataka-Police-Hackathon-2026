/**
 * CrimeLens AI - Confidence Engine
 */

export class ConfidenceEngine {
  public calculateConfidence(
    verifiedFirsCount: number,
    timelineComplete: boolean
  ): { level: "High" | "Medium" | "Low"; score: number } {
    let score = verifiedFirsCount * 40 + (timelineComplete ? 30 : 10);
    score = Math.min(Math.max(score, 40), 96);

    let level: "High" | "Medium" | "Low" = "Low";
    if (score >= 70) level = "High";
    else if (score >= 50) level = "Medium";

    return { level, score };
  }
}
