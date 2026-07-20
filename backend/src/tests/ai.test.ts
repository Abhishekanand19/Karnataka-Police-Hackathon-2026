/**
 * CrimeLens AI - AI Copilot Backend Engine Automated Test Suite
 */

import { QuestionProcessor } from "../ai/question-processor";
import { EvidenceValidator } from "../ai/evidence-validator";
import { CitationEngine } from "../ai/citation-engine";
import { ConfidenceEngine } from "../ai/confidence-engine";
import { AIGuardrails } from "../ai/guardrails";
import { CopilotAIService } from "../services/copilot-ai.service";

export async function runAITests() {
  console.log("=================================================");
  console.log("  CrimeLens AI - Running AI Engine Unit Tests    ");
  console.log("=================================================");

  // Test 1: Question Processor & Intent Detection
  const qp = new QuestionProcessor();
  const parsed = qp.parseQuestion("Why is Bengaluru Urban flagged with a hotspot spike?");
  if (parsed.intent !== "EXPLAIN_HOTSPOT" || parsed.extractedDistrict !== "Bengaluru Urban") {
    console.error("❌ TEST 1 FAILED: Question Processor intent parsing invalid.", parsed);
    process.exit(1);
  }
  console.log("✅ TEST 1 PASSED: Question Intent & Entity Extraction Verified.");

  // Test 2: Evidence Validator
  const validator = new EvidenceValidator();
  const validCheck = validator.validateEvidence(["FIR-2026-00491"], "Bengaluru Urban");
  if (!validCheck.valid || validCheck.verifiedFirsCount !== 1) {
    console.error("❌ TEST 2 FAILED: Evidence validator failed on valid FIR.");
    process.exit(1);
  }

  const invalidCheck = validator.validateEvidence(["FIR-NONEXISTENT-999"], "Bengaluru Urban");
  if (invalidCheck.valid) {
    console.error("❌ TEST 2 FAILED: Evidence validator accepted non-existent FIR!");
    process.exit(1);
  }
  console.log("✅ TEST 2 PASSED: Evidence Validator & Insufficient Evidence Guard Verified.");

  // Test 3: Citation & Confidence Engine
  const citationEngine = new CitationEngine();
  const citations = citationEngine.generateCitations(["FIR-2026-00491"], "Bengaluru Urban");
  const confidenceEngine = new ConfidenceEngine();
  const confidence = confidenceEngine.calculateConfidence(1, true);

  if (citations.length < 2 || confidence.level !== "High") {
    console.error("❌ TEST 3 FAILED: Citation or Confidence engine error.", { citations, confidence });
    process.exit(1);
  }
  console.log(`✅ TEST 3 PASSED: Citations (${citations.length}) & Confidence Level (${confidence.level} ${confidence.score}%) Verified.`);

  // Test 4: AI Guardrails
  const guardrails = new AIGuardrails();
  const rawText = "Suspect A is guilty and should be arrested immediately.";
  const sanitized = guardrails.sanitizeOutput(rawText);
  if (sanitized.includes("is guilty") || sanitized.includes("should be arrested immediately")) {
    console.error("❌ TEST 4 FAILED: AI Guardrails failed to sanitize output!", sanitized);
    process.exit(1);
  }
  console.log("✅ TEST 4 PASSED: AI Guardrails Output Sanitization Verified.");

  // Test 5: Master Copilot AI Service Pipeline
  const copilotService = new CopilotAIService();
  const response = await copilotService.processQuery("Explain Indiranagar property theft hotspot", "Bengaluru Urban", "FIR-2026-00491");
  if (!response.summary || !response.citations || response.citations.length === 0) {
    console.error("❌ TEST 5 FAILED: Copilot AI Service pipeline error.", response);
    process.exit(1);
  }
  console.log("✅ TEST 5 PASSED: Complete AI Copilot Pipeline Executed Successfully.");

  console.log("=================================================");
  console.log("  ALL AI ENGINE UNIT TESTS PASSED CLEANLY!       ");
  console.log("=================================================");
}

if (require.main === module) {
  runAITests();
}
