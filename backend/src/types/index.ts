/**
 * CrimeLens AI - Shared Backend Interface & Type Definitions
 */

export type UserRole = "Administrator" | "Supervisor" | "Investigator" | "Analyst";

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  stack?: string;
}

export interface RequestContext {
  userId?: string;
  role?: UserRole;
  badgeNumber?: string;
  district?: string;
  correlationId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  officerBadge: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  status: "SUCCESS" | "DENIED" | "FAILURE";
  details?: Record<string, any>;
}
