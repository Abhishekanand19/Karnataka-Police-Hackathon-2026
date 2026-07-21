import { Request, Response } from "express";
import { formatSuccessResponse, formatErrorResponse } from "../utils";
import {
  DashboardService,
  CaseService,
  SettingsService,
} from "../services";
import { CrimeStatisticsService } from "../services/crime-statistics.service";
import { DistrictAnalyticsService } from "../services/district-analytics.service";
import { HotspotEngineService } from "../services/hotspot-engine.service";
import { RepeatOffenderService } from "../services/repeat-offender.service";
import { NetworkBuilderService } from "../services/network-builder.service";
import { AlertEngineService } from "../services/alert-engine.service";
import { TimelineEngineService } from "../services/timeline-engine.service";
import { CopilotAIService } from "../services/copilot-ai.service";
import { CatalystAuthService } from "../auth/auth.service";
import { SmartBrowzReportGenerator } from "../reports/smartbrowz-report";
import { StratusStorageService } from "../storage/stratus-storage";
import { HealthMonitorService } from "../health/health-monitor";
import { AuditLogger } from "../audit/audit-logger";

const dashboardService = new DashboardService();
const caseService = new CaseService();
const settingsService = new SettingsService();

const crimeStatsService = new CrimeStatisticsService();
const districtAnalyticsService = new DistrictAnalyticsService();
const hotspotEngine = new HotspotEngineService();
const repeatOffenderService = new RepeatOffenderService();
const networkBuilder = new NetworkBuilderService();
const alertEngine = new AlertEngineService();
const timelineEngine = new TimelineEngineService();
const copilotAIService = new CopilotAIService();

const authService = new CatalystAuthService();
const reportGenerator = new SmartBrowzReportGenerator();
const storageService = new StratusStorageService();
const healthMonitor = new HealthMonitorService();

// Auth Endpoints
export const loginController = async (req: Request, res: Response) => {
  const { badgeNumber, secretKey } = req.body;
  const catalystApp = res.locals.catalyst;
  const session = await authService.login(catalystApp, badgeNumber || "KSP-89410", secretKey || "secret");
  AuditLogger.log(session.name, session.role, "LOGIN", "CatalystAuth", "SUCCESS", req.ip);
  res.json(formatSuccessResponse("Authentication successful", session));
};

export const logoutController = (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  authService.logout(token);
  AuditLogger.log((req as any).user?.name || "Officer", "Investigator", "LOGOUT", "CatalystAuth", "SUCCESS", req.ip);
  res.json(formatSuccessResponse("Logged out successfully"));
};

// Health Monitoring Endpoints
export const getHealth = (_req: Request, res: Response) => {
  const data = healthMonitor.getOverallHealth();
  res.json(formatSuccessResponse("CrimeLens AI Backend Service Operational", data));
};

export const getDatabaseHealth = (_req: Request, res: Response) => {
  const data = healthMonitor.getDatabaseHealth();
  res.json(formatSuccessResponse("Catalyst Data Store Health Payload", data));
};

export const getStorageHealth = (_req: Request, res: Response) => {
  const data = healthMonitor.getStorageHealth();
  res.json(formatSuccessResponse("Catalyst Stratus Storage Health Payload", data));
};

export const getAIHealth = (_req: Request, res: Response) => {
  const data = healthMonitor.getAIHealth();
  res.json(formatSuccessResponse("AI Copilot Reasoning Engine Health Payload", data));
};

export const getSystemHealth = (_req: Request, res: Response) => {
  const data = healthMonitor.getSystemHealth();
  res.json(formatSuccessResponse("Enterprise Node.js Runtime Health Payload", data));
};

// REST Analytics Endpoints
export const getDashboard = (_req: Request, res: Response) => {
  const stats = crimeStatsService.getOverallStatistics();
  const districts = districtAnalyticsService.getDistrictAnalytics();
  const repeatOffenders = repeatOffenderService.getRepeatOffenders();
  const data = {
    overview: dashboardService.getDashboardOverview(),
    stats,
    topDistricts: districts.slice(0, 5),
    repeatOffendersCount: repeatOffenders.length,
  };
  res.json(formatSuccessResponse("Dashboard intelligence overview payload retrieved", data));
};

export const getHotspots = (_req: Request, res: Response) => {
  const data = hotspotEngine.calculateHotspots();
  res.json(formatSuccessResponse("Spatial crime hotspots payload retrieved", data));
};

export const getNetwork = (_req: Request, res: Response) => {
  const data = networkBuilder.buildNetworkGraph();
  res.json(formatSuccessResponse("Criminal network relationship graph payload retrieved", data));
};

export const getNetworkByCaseId = (req: Request, res: Response) => {
  const paramId = req.params.caseId;
  const caseId = Array.isArray(paramId) ? paramId[0] : paramId || "FIR-2026-00491";
  const data = networkBuilder.buildNetworkGraph(caseId);
  res.json(formatSuccessResponse(`Criminal network graph payload for case ${caseId} retrieved`, data));
};

export const getCaseById = (req: Request, res: Response) => {
  const paramId = req.params.id;
  const caseId = Array.isArray(paramId) ? paramId[0] : paramId || "FIR-2026-00491";
  const data = caseService.getCaseDetails(caseId);
  res.json(formatSuccessResponse(`Case dossier payload for ${caseId} retrieved`, data));
};

export const getDistricts = (_req: Request, res: Response) => {
  const data = districtAnalyticsService.getDistrictAnalytics();
  res.json(formatSuccessResponse("District analytics payload retrieved", data));
};

export const getAlerts = (_req: Request, res: Response) => {
  const data = alertEngine.getActiveAlerts();
  res.json(formatSuccessResponse("Active system alerts payload retrieved", data));
};

export const getTimelineByCaseId = (req: Request, res: Response) => {
  const paramId = req.params.caseId;
  const caseId = Array.isArray(paramId) ? paramId[0] : paramId || "FIR-2026-00491";
  const data = timelineEngine.getCaseTimeline(caseId);
  res.json(formatSuccessResponse(`Timeline replay payload for case ${caseId} retrieved`, data));
};

export const getStatistics = (_req: Request, res: Response) => {
  const data = crimeStatsService.getOverallStatistics();
  res.json(formatSuccessResponse("Crime statistics payload retrieved", data));
};

export const getTrends = (_req: Request, res: Response) => {
  const data = {
    monthlyTrend: [
      { month: "Jan", crimes: 120 },
      { month: "Feb", crimes: 140 },
      { month: "Mar", crimes: 165 },
      { month: "Apr", crimes: 180 },
      { month: "May", crimes: 210 },
      { month: "Jun", crimes: 245 },
      { month: "Jul", crimes: 290 },
    ],
  };
  res.json(formatSuccessResponse("Crime trend series payload retrieved", data));
};

// AI Copilot Endpoints
export const queryCopilot = async (req: Request, res: Response) => {
  const { prompt, district, caseId } = req.body;
  const data = await copilotAIService.processQuery(prompt, district, caseId);
  res.json(formatSuccessResponse("Copilot evidence reasoning generated", data));
};

export const getCopilotContext = (req: Request, res: Response) => {
  const { caseId, district } = req.body;
  const data = { caseId: caseId || "FIR-2026-00491", district: district || "Bengaluru Urban", activeFirsCount: 4 };
  res.json(formatSuccessResponse("Copilot active context retrieved", data));
};

export const getCopilotHistory = (_req: Request, res: Response) => {
  const data = copilotAIService.getHistory();
  res.json(formatSuccessResponse("Copilot session history retrieved", data));
};

export const getCopilotSuggestions = (_req: Request, res: Response) => {
  const data = copilotAIService.getSuggestedPrompts();
  res.json(formatSuccessResponse("Copilot suggested prompts retrieved", data));
};

export const getCopilotSessionById = (req: Request, res: Response) => {
  const paramId = req.params.id;
  const sessionId = Array.isArray(paramId) ? paramId[0] : paramId || "sess-01";
  const data = { id: sessionId, title: "Bengaluru Urban Cyber Surge Brief", date: "Today 16:20 IST" };
  res.json(formatSuccessResponse(`Copilot session payload for ${sessionId} retrieved`, data));
};

export const submitCopilotFeedback = (req: Request, res: Response) => {
  const { sessionId, rating, comments } = req.body;
  res.json(formatSuccessResponse("Copilot feedback recorded", { sessionId, rating: rating || 5, comments: comments || "Accurate evidence citations" }));
};

// SmartBrowz Report & Stratus Upload Controller
export const createReport = async (req: Request, res: Response) => {
  try {
    const { reportType } = req.body;
    const catalystApp = res.locals.catalyst;
    const reportPayload = reportGenerator.generateReport(reportType || "Dossier");
    const storageRecord = await storageService.uploadReport(catalystApp, reportPayload.reportId, reportPayload);

    AuditLogger.log("Inspector V. Patil", "Investigator", "GENERATE_REPORT", reportPayload.reportId, "SUCCESS", req.ip);

    res.json(
      formatSuccessResponse("SmartBrowz Intelligence Dossier generated & uploaded to Stratus Storage", {
        report: reportPayload,
        storage: storageRecord,
      })
    );
  } catch (err: any) {
    res.status(500).json(formatErrorResponse("Report Generation Failed", err.message, 500));
  }
};

export const getSettings = (_req: Request, res: Response) => {
  const data = settingsService.getSettings();
  res.json(formatSuccessResponse("System settings payload retrieved", data));
};
