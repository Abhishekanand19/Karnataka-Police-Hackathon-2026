/**
 * CrimeLens AI - Prompt Construction Engine
 */

import { ParsedQuestion } from "./question-processor";
import { InvestigationContext } from "./context-builder";
import { RetrievedEvidence } from "./evidence-retriever";

export class PromptBuilder {
  public buildPrompt(
    question: ParsedQuestion,
    context: InvestigationContext,
    evidence: RetrievedEvidence
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are the CrimeLens AI Investigator Copilot for the Karnataka State Police (KSP) SCRB.
STRICT EXPLAINABILITY RULES:
1. Explain analytics strictly using cited evidence.
2. NEVER invent evidence, fabricate FIRs, or predict individual guilt.
3. Every response must state evidence sources explicitly.
4. If evidence is insufficient, state "Insufficient Evidence".`;

    const userPrompt = `Investigator Query: "${question.originalQuery}"
Target District: ${context.activeDistrictName}
Cited FIR Records: ${evidence.citedFirs.map((f) => f.id).join(", ")}
Primary Modus Operandi: ${evidence.primaryMO}
Police Stations: ${evidence.policeStations.join(", ")}
Associated Assets: Vehicles [${evidence.associatedVehicles.join(", ")}], Bank Mule A/C [${evidence.associatedMuleAccounts.join(", ")}]

Generate a structured intelligence briefing summarizing evidence and analytical reasoning.`;

    return { systemPrompt, userPrompt };
  }
}
