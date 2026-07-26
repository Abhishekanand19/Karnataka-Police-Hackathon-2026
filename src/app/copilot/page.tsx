"use client";

import React, { useState, useEffect } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { InvestigationContextSidebar } from "@/components/intelligence-assistant/investigation-context-sidebar";
import { ChatInterface, Message } from "@/components/intelligence-assistant/chat-interface";
import { MOCK_DB, FIR, Suspect } from "@/lib/mock-database";
import { AIResponseData } from "@/components/intelligence-assistant/response-formatter";

export default function CopilotPage() {
  const { activeInvestigation, activeFir, caseContext } = useInvestigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When context changes, reset chat and inject a system greeting
  useEffect(() => {
    if (activeInvestigation?.entityId) {
      setMessages([
        {
          id: "sys-1",
          role: "assistant",
          content: `I have loaded the case file for ${activeInvestigation.entityId}. I've ingested the FIR, evidence logs, connected suspects, and network geometry. How can I assist you with this investigation?`
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [activeInvestigation]);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Mock AI delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        structuredData: generateInvestigationResponse(text, activeFir?.firNumber || "Unknown", caseContext || undefined)
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const generateInvestigationResponse = (request: string, firId: string, loadedContext?: CaseContext): AIResponseData => {
    const fir = MOCK_DB.firs.find(f => f.firNumber === firId);
    if (!fir) return emptyResponse(firId);

    const context = loadedContext || buildCaseContext(fir);
    const intent = request.toLowerCase();
    if (intent.includes("fir summary") || intent.includes("fir summary")) return firSummary(fir, context);
    if (intent.includes("similar")) return similarCases(fir, context);
    if (intent.includes("risk")) return riskAssessment(fir, context);
    if (intent.includes("suspect")) return suspectProfile(fir, context);
    if (intent.includes("timeline") || intent.includes("chronological")) return timelineSummary(fir, context);
    if (intent.includes("case brief") || intent.includes("brief")) return caseBrief(fir, context);
    return investigatorAnswer(fir, context, request);
  };

  if (!mounted) return <div className="page-loading">Loading investigation context…</div>;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0a0c14]">
      
      {/* 25% Investigation Context Sidebar */}
      <div className="w-[350px] shrink-0 h-full">
        <InvestigationContextSidebar onQuickAction={handleSendMessage} />
      </div>

      {/* 75% Chat Interface */}
      <div className="flex-1 h-full min-w-0 border-l border-border/50 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] z-10 relative">
        {activeInvestigation ? (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isTyping={isTyping} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Please load an investigation from the workspace to begin an AI session.
          </div>
        )}
      </div>

    </div>
  );
}

type CaseContext = ReturnType<typeof buildCaseContext>;

function buildCaseContext(fir: FIR) {
  const suspects = MOCK_DB.suspects.filter(item => fir.linkedSuspects.includes(item.id));
  const evidence = MOCK_DB.evidence.filter(item => item.firId === fir.firNumber);
  const timeline = MOCK_DB.timelineEvents.filter(item => item.firId === fir.firNumber).sort((a, b) => a.stepNumber - b.stepNumber);
  const victims = MOCK_DB.victims.filter(item => item.firId === fir.firNumber);
  const accounts = MOCK_DB.bankAccounts.filter(item => item.firId === fir.firNumber);
  const phones = MOCK_DB.phoneRecords.filter(item => item.firId === fir.firNumber);
  return { suspects, evidence, timeline, victims, accounts, phones };
}

const evidenceLabels = (context: CaseContext) => context.evidence.slice(0, 4).map(item => item.title);
const names = (suspects: Suspect[]) => suspects.length ? suspects.map(item => item.name).join(", ") : "no named suspects";
const chronology = (context: CaseContext) => context.timeline.slice(0, 5).map(item => `${item.time} — ${item.title}: ${item.summary}`);

function response(summary: string, keyFindings: string[], context: CaseContext, reasoning: string, nextActions: string[], confidenceScore: number, links = ["Network", "Timeline"]): AIResponseData {
  return { summary, keyFindings, evidenceUsed: evidenceLabels(context), reasoning, confidenceScore, nextActions, links };
}

function caseBrief(fir: FIR, context: CaseContext) {
  return response(
    `Executive brief — ${fir.firNumber} is a ${fir.category} investigation registered at ${fir.station}, ${fir.district}, currently ${fir.status}. The case has ${context.suspects.length} linked suspect(s), ${context.evidence.length} evidence record(s), and a risk score of ${fir.riskScore}/100.`,
    [`Primary persons of interest: ${names(context.suspects)}.`, `${context.victims.length} complainant/victim record(s) and ${context.accounts.length} linked bank account(s) are in scope.`, `Latest case progression: ${context.timeline.at(-1)?.title || "no timeline event recorded"}.`], context,
    "This brief combines the FIR metadata with only records carrying the active FIR number; it does not infer links from other investigations.",
    ["Verify the active evidence inventory", "Review suspect-to-account links in the network", "Confirm the next procedural milestone"], 94, ["Network", "Timeline", "Dashboard"]);
}

function firSummary(fir: FIR, context: CaseContext) {
  return response(
    `Chronological FIR summary — ${fir.firNumber} was registered on ${fir.date} at ${fir.station} for ${fir.category}. The recorded investigative sequence is below.`,
    chronology(context), context,
    "Events are ordered by the FIR timeline step number, then displayed with their recorded event time. This is a reconstruction of recorded activity, not an assertion that every event happened in real-world order.",
    ["Compare timeline entries with the case diary", "Validate the evidence-lock event", "Open the full timeline for attachments"], 97, ["Timeline"]);
}

function similarCases(fir: FIR, context: CaseContext) {
  const matches = MOCK_DB.firs.filter(item => item.id !== fir.id).map(item => {
    const mo = item.category === fir.category;
    const location = item.district === fir.district;
    const shared = item.linkedSuspects.filter(id => fir.linkedSuspects.includes(id));
    return { item, mo, location, shared, score: Number(mo) + Number(location) + shared.length * 2 };
  }).filter(match => match.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);
  return response(
    matches.length ? `Similarity search identified ${matches.length} related FIR(s) using modus operandi, district, and shared-suspect signals for ${fir.firNumber}.` : `No related FIR met the MO, location, or suspect-overlap threshold for ${fir.firNumber}.`,
    matches.map(match => `${match.item.firNumber}: ${[match.mo && "same MO", match.location && `same district (${fir.district})`, match.shared.length && `shared suspect(s): ${match.shared.map(id => MOCK_DB.suspects.find(s => s.id === id)?.name).join(", ")}`].filter(Boolean).join("; ")}.`) || ["No qualifying relationship signals found."], context,
    "Each candidate receives one point for matching category, one for matching district, and two per shared suspect. Results are ranked by this evidence-based score.",
    ["Open matching FIRs from the workspace", "Compare shared suspects in the network", "Review MO-specific evidence"], matches.length ? 89 : 98, ["Network", "Dashboard"]);
}

function riskAssessment(fir: FIR, context: CaseContext) {
  const highRisk = context.suspects.filter(item => item.riskScore >= 80);
  const unresolved = context.accounts.filter(item => item.status !== "Frozen");
  return response(
    `Threat assessment — ${fir.firNumber} is scored ${fir.riskScore}/100. The score should be treated as a prioritisation signal, supported by the active case record rather than a prediction of guilt.`,
    [`${highRisk.length} linked suspect(s) have individual risk scores of 80 or above: ${names(highRisk)}.`, `${context.accounts.length} financial account(s) are associated with the FIR; ${unresolved.length} remain ${unresolved.length === 1 ? unresolved[0].status : "not frozen"}.`, `${context.phones.length} phone record(s) and ${context.evidence.length} evidence record(s) provide active corroboration paths.`], context,
    "The explanation weights the FIR's recorded risk score alongside high-risk linked suspects, financial controls, and the amount of corroborating case material. It does not use unrelated database records.",
    ["Prioritise high-risk suspect verification", "Confirm account-freeze status", "Escalate gaps in corroborating evidence"], 91, ["Network", "Timeline"]);
}

function suspectProfile(fir: FIR, context: CaseContext) {
  const primary = [...context.suspects].sort((a, b) => b.riskScore - a.riskScore);
  return response(
    `Suspect analysis only — ${fir.firNumber} has ${primary.length} linked suspect(s). This profile excludes victims, locations, and unrelated FIRs except where they are explicitly recorded on a suspect profile.`,
    primary.length ? primary.map(item => `${item.name}${item.alias ? ` (${item.alias})` : ""}: ${item.type}, ${item.status}, risk ${item.riskScore}/100; linked FIRs: ${item.linkedFIRs.join(", ") || "none recorded"}.`) : ["No suspects are linked to this FIR."], context,
    "Suspects are ranked by their recorded individual risk score. The output uses only the suspect table and the active FIR's linked-suspect IDs.",
    ["Verify the highest-risk suspect identity", "Review each suspect's linked FIR history", "Open direct connections in the network"], primary.length ? 93 : 100, ["Network"]);
}

function timelineSummary(fir: FIR, context: CaseContext) {
  return response(
    `Chronological reconstruction — ${fir.firNumber} contains ${context.timeline.length} recorded timeline event(s), from registration through the latest documented investigative step.`,
    chronology(context), context,
    "The reconstruction follows the case timeline's ordered step number and uses the recorded event summaries. Missing time detail is not filled with assumptions.",
    ["Check event attachments", "Confirm officers' updates against the case diary", "Open the interactive timeline"], 96, ["Timeline"]);
}

function investigatorAnswer(fir: FIR, context: CaseContext, request: string) {
  return response(
    `For ${fir.firNumber}, I interpreted your request as a case-context query: “${request}”. The available record is a ${fir.category} investigation in ${fir.district}.`,
    [`Status: ${fir.status}; risk score: ${fir.riskScore}/100.`, `Named suspect coverage: ${names(context.suspects)}.`, `Available material: ${context.evidence.length} evidence record(s), ${context.timeline.length} timeline event(s), and ${context.phones.length} phone record(s).`], context,
    "I used the active FIR identifier to limit retrieval to case-linked records. Ask for a Case Brief, FIR Summary, Similar Cases, Risk Assessment, Suspect Profile, or Timeline Summary for a focused analysis.",
    ["Generate Case Brief", "Find Similar Cases", "Generate Timeline Summary"], 86);
}

function emptyResponse(firId: string): AIResponseData {
  return { summary: `I could not load FIR ${firId}.`, keyFindings: ["Choose an investigation from the workspace before requesting analysis."], evidenceUsed: [], reasoning: "No active FIR context was available.", confidenceScore: 100, nextActions: ["Open workspace"], links: ["Dashboard"] };
}
