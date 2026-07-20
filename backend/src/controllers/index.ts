import { Request, Response } from "express";
import { formatSuccessResponse } from "../utils";
import {
  HealthService,
  DashboardService,
  HotspotService,
  NetworkService,
  CaseService,
  CopilotService,
  ReportService,
  SettingsService,
} from "../services";

const healthService = new HealthService();
const dashboardService = new DashboardService();
const hotspotService = new HotspotService();
const networkService = new NetworkService();
const caseService = new CaseService();
const copilotService = new CopilotService();
const reportService = new ReportService();
const settingsService = new SettingsService();

export const getHealth = (_req: Request, res: Response) => {
  const data = healthService.getHealthStatus();
  res.json(formatSuccessResponse("CrimeLens AI Backend Service Operational", data));
};

export const getDashboard = (_req: Request, res: Response) => {
  const data = dashboardService.getDashboardOverview();
  res.json(formatSuccessResponse("Dashboard overview payload retrieved", data));
};

export const getHotspots = (_req: Request, res: Response) => {
  const data = hotspotService.getHotspots();
  res.json(formatSuccessResponse("Hotspots payload retrieved", data));
};

export const getNetwork = (_req: Request, res: Response) => {
  const data = networkService.getNetworkGraph();
  res.json(formatSuccessResponse("Criminal network relationship payload retrieved", data));
};

export const getCaseById = (req: Request, res: Response) => {
  const paramId = req.params.id;
  const caseId = Array.isArray(paramId) ? paramId[0] : paramId || "FIR-2026-00491";
  const data = caseService.getCaseDetails(caseId);
  res.json(formatSuccessResponse(`Case dossier payload for ${caseId} retrieved`, data));
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
