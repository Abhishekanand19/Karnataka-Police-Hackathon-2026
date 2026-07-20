/**
 * CrimeLens AI - Enterprise Audit Logging System
 */

import { logger } from "../logger";

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  result: "SUCCESS" | "DENIED" | "FAILURE";
  ipAddress: string;
}

export class AuditLogger {
  private static auditLogs: AuditRecord[] = [];

  public static log(
    user: string,
    role: string,
    action: string,
    target: string,
    result: "SUCCESS" | "DENIED" | "FAILURE",
    ipAddress: string = "127.0.0.1"
  ): AuditRecord {
    const record: AuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      user,
      role,
      action,
      target,
      result,
      ipAddress,
    };

    AuditLogger.auditLogs.push(record);
    logger.info(`[AUDIT LOG] ${record.user} (${record.role}) -> ${record.action} on ${record.target} [${record.result}]`);

    return record;
  }

  public static getLogs(): AuditRecord[] {
    return AuditLogger.auditLogs;
  }
}
