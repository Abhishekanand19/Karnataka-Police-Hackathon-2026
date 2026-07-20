"use client";

import React, { useState } from "react";
import { Send, Sparkles, Paperclip, Trash2, FileText, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PromptInputPanelProps {
  onSubmitPrompt: (promptText: string) => void;
  onClearConversation?: () => void;
  onGenerateBrief?: () => void;
}

export const promptSuggestions = [
  "Why is Bengaluru Urban flagged with a High Risk Score this week?",
  "Explain the Indiranagar property theft hotspot & cited FIRs",
  "Show identified repeat offenders linked to 3+ complaints",
  "Compare crime trend surge: Mysuru vs. Dakshina Kannada",
  "Explain criminal network relationships for Suspect #A-901",
  "Generate statewide executive intelligence summary",
];

export const PromptInputPanel: React.FC<PromptInputPanelProps> = ({
  onSubmitPrompt,
  onClearConversation,
  onGenerateBrief,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    onSubmitPrompt(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-card/90 border border-card-border rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3">
      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 font-medium flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Suggested Prompts:
        </span>
        {promptSuggestions.slice(0, 4).map((sug) => (
          <button
            key={sug}
            onClick={() => {
              setPrompt(sug);
              onSubmitPrompt(sug);
            }}
            className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-primary text-gray-300 hover:text-white shrink-0 transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Textarea Input Form */}
      <form onSubmit={handleSubmit} className="relative space-y-2">
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Copilot to explain hotspots, summarize FIR evidence, or trace criminal networks..."
          className="w-full bg-surface text-gray-100 border border-border rounded-xl p-3 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-colors"
        />

        {/* Input Action Controls */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert("Attach Case / FIR Record placeholder")}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface transition-colors flex items-center gap-1"
              title="Attach FIR / Document"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Attach FIR</span>
            </button>

            {onGenerateBrief && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={onGenerateBrief}
              >
                Generate Brief
              </Button>
            )}

            {onClearConversation && (
              <button
                type="button"
                onClick={onClearConversation}
                className="p-1.5 rounded-lg text-gray-400 hover:text-semantic-danger hover:bg-surface transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] font-mono text-gray-500">
              Press <kbd className="bg-surface px-1 py-0.5 rounded border border-border">Ctrl+Enter</kbd> to send
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!prompt.trim()}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Ask Copilot
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
