/**
 * CrimeLens AI - Question Processor & Intent Detection Engine
 */

export type AIIntent =
  | "EXPLAIN_HOTSPOT"
  | "SUMMARIZE_CASE"
  | "COMPARE_DISTRICTS"
  | "SHOW_REPEAT_OFFENDERS"
  | "FIND_SIMILAR_CRIMES"
  | "EXPLAIN_NETWORK"
  | "GENERATE_EXECUTIVE_SUMMARY"
  | "GENERAL_INVESTIGATION_QUERY";

export interface ParsedQuestion {
  originalQuery: string;
  intent: AIIntent;
  extractedCaseId?: string;
  extractedDistrict?: string;
  extractedCrimeCategory?: string;
  extractedSuspectId?: string;
}

export class QuestionProcessor {
  public parseQuestion(query: string): ParsedQuestion {
    const q = query.toLowerCase();

    let intent: AIIntent = "GENERAL_INVESTIGATION_QUERY";
    if (q.includes("hotspot") || q.includes("spatial")) intent = "EXPLAIN_HOTSPOT";
    else if (q.includes("summarize") || q.includes("summary") || q.includes("fir")) intent = "SUMMARIZE_CASE";
    else if (q.includes("compare") || q.includes("district")) intent = "COMPARE_DISTRICTS";
    else if (q.includes("repeat") || q.includes("offender") || q.includes("habitual")) intent = "SHOW_REPEAT_OFFENDERS";
    else if (q.includes("similar") || q.includes("modus operandi") || q.includes("mo")) intent = "FIND_SIMILAR_CRIMES";
    else if (q.includes("network") || q.includes("relationship") || q.includes("graph")) intent = "EXPLAIN_NETWORK";
    else if (q.includes("executive") || q.includes("brief")) intent = "GENERATE_EXECUTIVE_SUMMARY";

    // Extract Case FIR ID
    const firMatch = query.match(/FIR-\d{4}-\d{5}/i);
    const caseId = firMatch ? firMatch[0].toUpperCase() : undefined;

    // Extract District Name
    let district: string | undefined = undefined;
    if (q.includes("bengaluru")) district = "Bengaluru Urban";
    else if (q.includes("mysuru")) district = "Mysuru City";
    else if (q.includes("dakshina kannada") || q.includes("mangalore")) district = "Dakshina Kannada";
    else if (q.includes("belagavi")) district = "Belagavi";

    return {
      originalQuery: query,
      intent,
      extractedCaseId: caseId,
      extractedDistrict: district,
    };
  }
}
