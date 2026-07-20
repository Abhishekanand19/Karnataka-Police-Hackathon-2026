import { Request, Response } from "express";
import { formatSuccessResponse } from "../utils";
import {
  HealthService,
  DashboardService,
  CaseService,
  ReportService,
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

const healthService = new HealthService();
const dashboardService = new DashboardService();
const caseService = new CaseService();
const reportService = new ReportService();
const settingsService = new SettingsService();

const crimeStatsService = new CrimeStatisticsService();
const districtAnalyticsService = new DistrictAnalyticsService();
const hotspotEngine = new HotspotEngineService();
const repeatOffenderService = new RepeatOffenderService();
const networkBuilder = new NetworkBuilderService();
const alertEngine = new AlertEngineService();
const timelineEngine = new TimelineEngineService();
const copilotAIService = new CopilotAIService();

export const getHealth = (_req: Request, res: Response) => {
  const data = healthService.getHealthStatus();
  res.json(formatSuccessResponse("CrimeLens AI Backend Service Operational", data));
};

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

// AI Copilot Controllers
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

export const createReport = (req: Request, res: Response) => {
  const { reportType } = req.body;
  const data = reportService.generateReport(reportType || "Dossier");
  res.json(formatSuccessResponse("Dossier report payload generated", data));
};

export const getSettings = (_req: Request, res: Response) => {
  const data = settingsService.getSettings();
  res.json(formatSuccessResponse("System settings payload retrieved", data));
};
