/**
 * CrimeLens AI - Guardrails & Safety Filter
 */

export class AIGuardrails {
  public sanitizeOutput(text: string): string {
    let sanitized = text;

    // Forbid illegal legal predictions
    sanitized = sanitized.replace(/is guilty/gi, "is suspect under investigation");
    sanitized = sanitized.replace(/should be arrested immediately/gi, "warrants investigative review");
    sanitized = sanitized.replace(/will commit crime/gi, "shows statistical risk correlation");

    return sanitized;
  }
}
