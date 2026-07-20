import { Router } from "express";
import {
  loginController,
  logoutController,
  getHealth,
  getDatabaseHealth,
  getStorageHealth,
  getAIHealth,
  getSystemHealth,
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
  getCopilotContext,
  getCopilotHistory,
  getCopilotSuggestions,
  getCopilotSessionById,
  submitCopilotFeedback,
  createReport,
  getSettings,
} from "../controllers";
import { validateInput, auditLoggerMiddleware } from "../middleware";
import { RBACGuard } from "../auth/rbac";
import { CopilotQuerySchema, ReportRequestSchema } from "../validators";

const router = Router();

// Authentication Endpoints
router.post("/auth/login", loginController);
router.post("/auth/logout", logoutController);

// Health Monitoring Suite
router.get("/health", getHealth);
router.get("/health/database", getDatabaseHealth);
router.get("/health/storage", getStorageHealth);
router.get("/health/ai", getAIHealth);
router.get("/health/system", getSystemHealth);

// Protected REST Analytics Endpoints
router.get("/dashboard", RBACGuard.checkPermission("VIEW_DASHBOARD"), auditLoggerMiddleware("VIEW_DASHBOARD"), getDashboard);
router.get("/hotspots", RBACGuard.checkPermission("VIEW_HOTSPOTS"), auditLoggerMiddleware("VIEW_HOTSPOTS"), getHotspots);
router.get("/network", RBACGuard.checkPermission("VIEW_NETWORK"), auditLoggerMiddleware("VIEW_NETWORK"), getNetwork);
router.get("/network/:caseId", RBACGuard.checkPermission("VIEW_NETWORK"), auditLoggerMiddleware("VIEW_CASE_NETWORK"), getNetworkByCaseId);
router.get("/case/:id", RBACGuard.checkPermission("VIEW_CASE"), auditLoggerMiddleware("VIEW_CASE"), getCaseById);
router.get("/districts", RBACGuard.checkPermission("VIEW_DISTRICTS"), auditLoggerMiddleware("VIEW_DISTRICTS"), getDistricts);
router.get("/alerts", RBACGuard.checkPermission("VIEW_DASHBOARD"), auditLoggerMiddleware("VIEW_ALERTS"), getAlerts);
router.get("/timeline/:caseId", RBACGuard.checkPermission("VIEW_TIMELINE"), auditLoggerMiddleware("VIEW_TIMELINE"), getTimelineByCaseId);
router.get("/statistics", RBACGuard.checkPermission("VIEW_STATISTICS"), auditLoggerMiddleware("VIEW_STATISTICS"), getStatistics);
router.get("/trends", RBACGuard.checkPermission("VIEW_TRENDS"), auditLoggerMiddleware("VIEW_TRENDS"), getTrends);

// AI Copilot Endpoints
router.post(
  "/copilot/query",
  RBACGuard.checkPermission("COPILOT_QUERY"),
  validateInput(CopilotQuerySchema),
  auditLoggerMiddleware("COPILOT_QUERY"),
  queryCopilot
);
router.post("/copilot/context", RBACGuard.checkPermission("COPILOT_QUERY"), auditLoggerMiddleware("COPILOT_CONTEXT"), getCopilotContext);
router.get("/copilot/history", RBACGuard.checkPermission("COPILOT_QUERY"), auditLoggerMiddleware("COPILOT_HISTORY"), getCopilotHistory);
router.get("/copilot/suggestions", RBACGuard.checkPermission("COPILOT_QUERY"), auditLoggerMiddleware("COPILOT_SUGGESTIONS"), getCopilotSuggestions);
router.get("/copilot/session/:id", RBACGuard.checkPermission("COPILOT_QUERY"), auditLoggerMiddleware("COPILOT_SESSION"), getCopilotSessionById);
router.post("/copilot/feedback", RBACGuard.checkPermission("COPILOT_QUERY"), auditLoggerMiddleware("COPILOT_FEEDBACK"), submitCopilotFeedback);

// Report Generation Endpoint
router.post(
  "/report",
  RBACGuard.checkPermission("GENERATE_REPORT"),
  validateInput(ReportRequestSchema),
  auditLoggerMiddleware("GENERATE_REPORT"),
  createReport
);

// System Settings Endpoint
router.get("/settings", RBACGuard.checkPermission("VIEW_DASHBOARD"), auditLoggerMiddleware("VIEW_SETTINGS"), getSettings);

export default router;
