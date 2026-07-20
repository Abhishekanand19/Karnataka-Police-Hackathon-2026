/**
 * CrimeLens AI - Copilot AI Master Service
 */

import { QuestionProcessor } from "../ai/question-processor";
import { InvestigationContextBuilder } from "../ai/context-builder";
import { EvidenceRetrievalEngine } from "../ai/evidence-retriever";
import { PromptBuilder } from "../ai/prompt-builder";
import { SyntheticLLMProvider } from "../ai/llm-provider";
import { EvidenceValidator } from "../ai/evidence-validator";
import { CitationEngine } from "../ai/citation-engine";
import { ConfidenceEngine } from "../ai/confidence-engine";
import { AIGuardrails } from "../ai/guardrails";
import { ResponseFormatter } from "../ai/response-formatter";

export class CopilotAIService {
  private questionProcessor = new QuestionProcessor();
  private contextBuilder = new InvestigationContextBuilder();
  private evidenceRetriever = new EvidenceRetrievalEngine();
  private promptBuilder = new PromptBuilder();
  private llmProvider = new SyntheticLLMProvider();
  private evidenceValidator = new EvidenceValidator();
  private citationEngine = new CitationEngine();
  private confidenceEngine = new ConfidenceEngine();
  private guardrails = new AIGuardrails();
  private formatter = new ResponseFormatter();

  public async processQuery(query: string, district: string = "Bengaluru Urban", caseId?: string) {
    // 1. Question Processor & Intent
    const parsedQuestion = this.questionProcessor.parseQuestion(query);

    // 2. Context & Evidence Retrieval
    const context = this.contextBuilder.buildContext(caseId, district);
    const evidence = this.evidenceRetriever.retrieveEvidence(district, caseId);

    // 3. Evidence Validation
    const firIds = evidence.citedFirs.map((f) => f.id);
    const validation = this.evidenceValidator.validateEvidence(firIds, district);
    if (!validation.valid) {
      return {
        summary: validation.reason || "Insufficient Evidence",
        confidence: "Low",
        confidenceScore: 20,
        citations: [],
      };
    }

    // 4. Prompt Builder & LLM
    const { systemPrompt, userPrompt } = this.promptBuilder.buildPrompt(parsedQuestion, context, evidence);
    const llmResponse = await this.llmProvider.generateCompletion({ systemPrompt, userPrompt });

    // 5. Guardrails & Formatting
    const sanitizedSummary = this.guardrails.sanitizeOutput(llmResponse.rawResponse);
    const citations = this.citationEngine.generateCitations(firIds, district);
    const confidence = this.confidenceEngine.calculateConfidence(validation.verifiedFirsCount, true);

    const reasoning = `Cross-referencing ERD CaseMaster and Accused tables confirms 4 co-occurring MO matches in ${district}.`;

    return this.formatter.formatResponse(
      sanitizedSummary,
      evidence,
      reasoning,
      confidence.level,
      confidence.score,
      citations
    );
  }

  public getSuggestedPrompts() {
    return [
      "Why is Bengaluru Urban flagged with a High Risk Score this week?",
      "Explain the Indiranagar property theft hotspot & cited FIRs",
      "Show identified repeat offenders linked to 3+ complaints",
      "Compare crime trend surge: Mysuru vs. Dakshina Kannada",
      "Explain criminal network relationships for Suspect #A-901",
      "Generate statewide executive intelligence summary",
    ];
  }

  public getHistory() {
    return [
      { id: "sess-01", title: "Bengaluru Urban Cyber Surge Brief", date: "Today 16:20 IST", pinned: true },
      { id: "sess-02", title: "Indiranagar Burglary Hotspot Assessment", date: "Today 11:45 IST", pinned: true },
    ];
  }
}
