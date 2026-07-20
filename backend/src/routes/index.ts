import { Router } from "express";
import {
  getHealth,
  getDashboard,
  getHotspots,
  getNetwork,
  getNetworkByCaseId,
  getCaseById,
  getDistricts,
  getAlerts,
  getTimelineByCaseId,
  getStatistics,
  getTrends,
  queryCopilot,
  createReport,
  getSettings,
} from "../controllers";
import { validateInput, auditLoggerMiddleware } from "../middleware";
import { CopilotQuerySchema, ReportRequestSchema } from "../validators";

const router = Router();

// Health Check Endpoint
router.get("/health", getHealth);

// REST Analytics APIs
router.get("/dashboard", auditLoggerMiddleware("VIEW_DASHBOARD"), getDashboard);
router.get("/hotspots", auditLoggerMiddleware("VIEW_HOTSPOTS"), getHotspots);
router.get("/network", auditLoggerMiddleware("VIEW_NETWORK"), getNetwork);
router.get("/network/:caseId", auditLoggerMiddleware("VIEW_CASE_NETWORK"), getNetworkByCaseId);
router.get("/case/:id", auditLoggerMiddleware("VIEW_CASE"), getCaseById);
router.get("/districts", auditLoggerMiddleware("VIEW_DISTRICTS"), getDistricts);
router.get("/alerts", auditLoggerMiddleware("VIEW_ALERTS"), getAlerts);
router.get("/timeline/:caseId", auditLoggerMiddleware("VIEW_TIMELINE"), getTimelineByCaseId);
router.get("/statistics", auditLoggerMiddleware("VIEW_STATISTICS"), getStatistics);
router.get("/trends", auditLoggerMiddleware("VIEW_TRENDS"), getTrends);

// Copilot AI Reasoning Endpoint
router.post(
  "/copilot/query",
  validateInput(CopilotQuerySchema),
  auditLoggerMiddleware("COPILOT_QUERY"),
  queryCopilot
);

// Report Generation Endpoint
router.post(
  "/report",
  validateInput(ReportRequestSchema),
  auditLoggerMiddleware("GENERATE_REPORT"),
  createReport
);

// System Settings Endpoint
router.get("/settings", auditLoggerMiddleware("VIEW_SETTINGS"), getSettings);

export default router;
