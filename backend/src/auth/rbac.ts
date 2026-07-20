/**
 * CrimeLens AI - Role Based Access Control (RBAC) System
 */

import { Request, Response, NextFunction } from "express";
import { formatErrorResponse } from "../utils";

export type UserRole = "Administrator" | "Supervisor" | "Investigator" | "CrimeAnalyst";

export const PERMISSIONS: Record<UserRole, string[]> = {
  Administrator: ["*"],
  Supervisor: ["VIEW_*", "GENERATE_REPORT", "COPILOT_QUERY", "APPROVE_*"],
  Investigator: ["VIEW_DASHBOARD", "VIEW_HOTSPOTS", "VIEW_NETWORK", "VIEW_CASE", "VIEW_TIMELINE", "COPILOT_QUERY", "GENERATE_REPORT"],
  CrimeAnalyst: ["VIEW_DASHBOARD", "VIEW_HOTSPOTS", "VIEW_STATISTICS", "VIEW_TRENDS", "COPILOT_QUERY"],
};

export class RBACGuard {
  public static checkPermission(requiredPermission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const userRole: UserRole = (req as any).user?.role || "Investigator";
      const userPermissions = PERMISSIONS[userRole] || [];

      const hasPermission =
        userPermissions.includes("*") ||
        userPermissions.includes(requiredPermission) ||
        userPermissions.some((p) => p.endsWith("*") && requiredPermission.startsWith(p.replace("*", "")));

      if (!hasPermission) {
        res
          .status(403)
          .json(formatErrorResponse("Permission Denied", `Role [${userRole}] lacks permission [${requiredPermission}]`, 403));
        return;
      }

      next();
    };
  }
}
