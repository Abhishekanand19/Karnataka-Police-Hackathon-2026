import { Router } from "express";
import {
  getHealth,
  getDashboard,
  getHotspots,
  getNetwork,
  getCaseById,
  queryCopilot,
  createReport,
  getSettings,
} from "../controllers";
import { validateInput, auditLoggerMiddleware } from "../middleware";
import { CopilotQuerySchema, ReportRequestSchema } from "../validators";

const router = Router();

// Health Check Endpoint
router.get("/health", getHealth);

// Dashboard Endpoints
router.get("/dashboard", auditLoggerMiddleware("VIEW_DASHBOARD"), getDashboard);

// Hotspots Endpoints
router.get("/hotspots", auditLoggerMiddleware("VIEW_HOTSPOTS"), getHotspots);

// Network Endpoints
router.get("/network", auditLoggerMiddleware("VIEW_NETWORK"), getNetwork);

// Case Details Endpoint
router.get("/case/:id", auditLoggerMiddleware("VIEW_CASE"), getCaseById);

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
