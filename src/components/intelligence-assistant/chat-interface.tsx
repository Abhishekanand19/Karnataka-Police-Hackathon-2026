"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { ResponseFormatter } from "./response-formatter";
import { AIResponseData } from "@/lib/copilot-engine";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  structuredData?: AIResponseData;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c14] relative">
      
      {/* Top Bar / Guardrails */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center bg-gradient-to-b from-[#0a0c14] to-transparent z-10 pointer-events-none">
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
          <span>Model: KSP-Intelligence-v4</span>
          <span>•</span>
          <span>Data Sync: Live</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 xl:px-32 pt-20 pb-24 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 border ${
              msg.role === "assistant" ? "bg-primary/20 border-primary text-primary" : "bg-card border-border text-gray-400"
            }`}>
              {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm mb-2">
                {msg.role === "assistant" ? "CrimeLens Intelligence" : "Investigator"}
              </div>
              
              {msg.role === "user" ? (
                <div className="text-gray-200 leading-relaxed text-sm">{msg.content}</div>
              ) : msg.structuredData ? (
                <ResponseFormatter data={msg.structuredData} onFollowUp={onSendMessage} />
              ) : (
                <div className="text-gray-200 leading-relaxed text-sm">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 border bg-primary/20 border-primary text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm mb-2">CrimeLens Intelligence</div>
              <div className="flex gap-1.5 items-center h-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:px-12 xl:px-32 bg-gradient-to-t from-[#0a0c14] via-[#0a0c14] to-transparent">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask a question about this investigation or request a specific analysis..."
            className="w-full bg-surface/90 backdrop-blur-md border border-border/80 focus:border-primary rounded-2xl py-4 pl-4 pr-14 text-sm text-white shadow-2xl outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary hover:bg-primary-hover disabled:bg-card disabled:text-gray-500 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center mt-2 text-[10px] text-gray-500 font-medium">
          CrimeLens AI can make mistakes. Verify critical intelligence against core databases.
        </div>
      </div>

    </div>
  );
};
