/**
 * CrimeLens AI - Pluggable LLM Provider Abstraction
 */

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export interface LLMResponse {
  rawResponse: string;
  providerName: string;
  tokenUsage?: { promptTokens: number; completionTokens: number };
}

export interface LLMProvider {
  name: string;
  generateCompletion(request: LLMRequest): Promise<LLMResponse>;
}

export class SyntheticLLMProvider implements LLMProvider {
  public name = "SyntheticIntelligenceProvider";

  public async generateCompletion(_request: LLMRequest): Promise<LLMResponse> {
    return {
      providerName: this.name,
      rawResponse: `Statewide crime intelligence indicates an emerging property theft & cyber fraud cluster in Bengaluru Urban. 4 linked FIRs registered between July 12 and July 18, 2026 share matching forced-entry MO and mule bank account contacts.`,
      tokenUsage: { promptTokens: 140, completionTokens: 85 },
    };
  }
}

export class CatalystQuickMLProvider implements LLMProvider {
  public name = "CatalystQuickMLProvider";

  public async generateCompletion(request: LLMRequest): Promise<LLMResponse> {
    return {
      providerName: this.name,
      rawResponse: `QuickML Synthesized Briefing: ${request.userPrompt.substring(0, 100)}...`,
      tokenUsage: { promptTokens: 120, completionTokens: 60 },
    };
  }
}
