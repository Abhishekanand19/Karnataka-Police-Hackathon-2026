import { z } from "zod";

export const CaseQuerySchema = z.object({
  caseId: z.string().optional(),
  district: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
});

export const CopilotQuerySchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters"),
  district: z.string().optional(),
  caseId: z.string().optional(),
});

export const ReportRequestSchema = z.object({
  reportType: z.string(),
  district: z.string().optional(),
  dateRange: z.string().optional(),
});
