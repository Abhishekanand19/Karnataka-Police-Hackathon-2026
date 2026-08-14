"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInvestigation } from "@/providers/investigation-provider";
import { InvestigationContextSidebar } from "@/components/intelligence-assistant/investigation-context-sidebar";
import { ChatInterface, Message } from "@/components/intelligence-assistant/chat-interface";
import { CopilotCase, CopilotTurn, generateCopilotResponse, copilotGreeting } from "@/lib/copilot-engine";

const CHAT_KEY = "crimeLensCopilotChat:";

export default function CopilotPage() {
  const { activeInvestigation, caseContext } = useInvestigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // The active-case bundle the engine reasons over.
  const buildCase = (): CopilotCase | null => {
    if (!caseContext) return null;
    return {
      fir: caseContext.fir,
      suspects: caseContext.suspects,
      evidence: caseContext.evidence,
      timeline: caseContext.timeline,
      victims: caseContext.victims,
      accounts: caseContext.accounts,
      phones: caseContext.phones,
      vehicles: caseContext.vehicles,
      relatedFirs: caseContext.relatedFirs,
    };
  };

  // Restore the saved conversation for this case, or greet if it's the first visit.
  // Persisting per-FIR means leaving for Network/Reports and coming back keeps the thread.
  useEffect(() => {
    const cc = buildCase();
    const firKey = activeInvestigation?.entityId;
    if (firKey && cc) {
      try {
        const saved = sessionStorage.getItem(CHAT_KEY + firKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Message[];
          if (Array.isArray(parsed) && parsed.length) { setMessages(parsed); return; }
        }
      } catch { /* ignore malformed cache */ }
      setMessages([{ id: "sys-1", role: "assistant", content: copilotGreeting(cc) }]);
    } else {
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeInvestigation?.entityId]);

  // Persist the thread on every change so navigation never drops it.
  useEffect(() => {
    const firKey = activeInvestigation?.entityId;
    if (!firKey || messages.length === 0) return;
    try { sessionStorage.setItem(CHAT_KEY + firKey, JSON.stringify(messages)); } catch { /* quota */ }
  }, [messages, activeInvestigation?.entityId]);

  const handleSendMessage = (text: string) => {
    const cc = buildCase();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };

    // Snapshot conversation history for the engine's memory BEFORE adding the new turn.
    const history: CopilotTurn[] = messages.map(m => ({
      role: m.role,
      text: m.content,
      intent: m.structuredData?.intent,
    }));

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Latency scales slightly with question length so it feels like real thinking, not a fixed stub.
    const delay = 900 + Math.min(1400, text.length * 22);
    timerRef.current = setTimeout(() => {
      const structured = cc
        ? generateCopilotResponse(text, cc, history)
        : undefined;
      const aiMsg: Message = structured
        ? { id: (Date.now() + 1).toString(), role: "assistant", structuredData: structured }
        : { id: (Date.now() + 1).toString(), role: "assistant", content: "No active case is loaded. Select an investigation from the workspace to begin." };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  if (!mounted) return <div className="page-loading">Loading investigation context…</div>;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0a0c14]">
      <div className="w-[350px] shrink-0 h-full">
        <InvestigationContextSidebar onQuickAction={handleSendMessage} />
      </div>

      <div className="flex-1 h-full min-w-0 border-l border-border/50 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] z-10 relative">
        {activeInvestigation ? (
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Please load an investigation from the workspace to begin an AI session.
          </div>
        )}
      </div>
    </div>
  );
}
