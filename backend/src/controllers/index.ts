import { Request, Response } from "express";
import { formatSuccessResponse } from "../utils";
import {
  HealthService,
  DashboardService,
  CaseService,
  CopilotService,
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

const healthService = new HealthService();
const dashboardService = new DashboardService();
const caseService = new CaseService();
const copilotService = new CopilotService();
const reportService = new ReportService();
const settingsService = new SettingsService();

const crimeStatsService = new CrimeStatisticsService();
const districtAnalyticsService = new DistrictAnalyticsService();
const hotspotEngine = new HotspotEngineService();
const repeatOffenderService = new RepeatOffenderService();
const networkBuilder = new NetworkBuilderService();
const alertEngine = new AlertEngineService();
const timelineEngine = new TimelineEngineService();

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

export const queryCopilot = (req: Request, res: Response) => {
  const { prompt } = req.body;
  const data = copilotService.processQuery(prompt || "Explain Bengaluru crime surge");
  res.json(formatSuccessResponse("Copilot reasoning payload generated", data));
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
