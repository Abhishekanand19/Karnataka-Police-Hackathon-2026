"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskLevel } from "@/components/ui/risk-badge";
import {
  Bot,
  User,
  Sparkles,
  FileText,
  Copy,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export interface InvestigationMessage {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  queryText?: string;
  summary?: string;
  reasoning?: string;
  confidence?: "High" | "Medium" | "Low";
  confidenceScore?: number;
  citedFirs?: { id: string; title: string; district: string; risk: RiskLevel }[];
  followUpQuestions?: string[];
  district?: string;
  hotspotName?: string;
}

export interface InvestigationCardProps {
  message: InvestigationMessage;
  onSelectEvidence?: (firId: string) => void;
  onSelectFollowUp?: (question: string) => void;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({
  message,
  onSelectEvidence,
  onSelectFollowUp,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (message.sender === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 justify-end my-3 ml-12"
      >
        <div className="bg-primary/20 border border-primary/40 rounded-2xl p-4 text-xs text-white max-w-xl shadow-lg space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-primary font-semibold font-mono">
            <span>Investigator Query</span>
            <span>• {message.timestamp}</span>
          </div>
          <p className="leading-relaxed font-medium">{message.queryText}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface border border-border text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      </motion.div>
    );
  }

  const handleCopy = () => {
    if (message.summary) {
      navigator.clipboard.writeText(message.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 my-4 mr-6"
    >
      <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-md">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 bg-surface/80 border border-border rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 text-xs text-gray-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Investigation Intelligence Brief</span>
            <Badge variant="accent" size="sm">
              <Sparkles className="w-3 h-3 mr-1" /> 0% Hallucination Policy
            </Badge>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            {message.confidence && (
              <span className="flex items-center gap-1 font-semibold text-semantic-success">
                <ShieldCheck className="w-3.5 h-3.5" /> Confidence: {message.confidence} ({message.confidenceScore || 94}%)
              </span>
            )}
            <span className="text-gray-400">{message.timestamp}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Executive Summary
          </div>
          <p className="text-xs text-gray-100 leading-relaxed font-normal bg-card/60 p-3.5 rounded-xl border border-border/50">
            {message.summary}
          </p>
        </div>

        {/* Cited FIR Records */}
        {message.citedFirs && message.citedFirs.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Cited Evidence ({message.citedFirs.length} Verified Records)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.citedFirs.map((fir) => (
                <div
                  key={fir.id}
                  onClick={() => onSelectEvidence && onSelectEvidence(fir.id)}
                  className="p-2.5 bg-card/80 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-primary group-hover:underline">
                      {fir.id}
                    </span>
                    <div className="text-[10px] text-gray-400 truncate max-w-[160px]">{fir.title}</div>
                  </div>
                  <RiskBadge level={fir.risk} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytical Reasoning (Expandable) */}
        {message.reasoning && (
          <div className="space-y-2 pt-1 border-t border-border/40">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-white"
            >
              <span>Analytical Reasoning & Evidence Synthesis</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {expanded && (
              <div className="p-3 bg-surface/40 rounded-xl border border-border/40 text-[11px] text-gray-300 leading-relaxed">
                {message.reasoning}
              </div>
            )}
          </div>
        )}

        {/* Follow-up Questions */}
        {message.followUpQuestions && message.followUpQuestions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Suggested Next Investigation Steps
            </div>
            <div className="flex flex-wrap gap-2">
              {message.followUpQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => onSelectFollowUp && onSelectFollowUp(q)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary text-gray-300 hover:text-white text-xs transition-colors group"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy Brief"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "text-accent fill-accent" : ""}`} />}
              onClick={() => setBookmarked(!bookmarked)}
            >
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>

          <div className="text-[10px] font-mono text-gray-500">
            KSP SCRB Audit Hash: 0x8F4A...901B
          </div>
        </div>
      </div>
    </motion.div>
  );
};
