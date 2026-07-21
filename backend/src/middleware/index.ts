import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { formatErrorResponse } from "../utils";
import { ZodSchema } from "zod";
import catalyst from "zcatalyst-sdk-node";

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });
  next();
};

export const validateInput = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json(formatErrorResponse("Invalid Request Body", err.message || "Validation Error", 400));
    }
  };
};

export const catalystInitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.catalyst = catalyst.initialize(req as any);
  } catch (err: any) {
    logger.debug(`Catalyst Initialization Notice: ${err.message}`);
    res.locals.catalyst = null;
  }
  next();
};

export const roleAuthMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role || "Investigator";
    if (!roles.includes(userRole)) {
      res.status(403).json(formatErrorResponse("Access Denied", "Insufficient Permissions", 403));
      return;
    }
    next();
  };
};

export const auditLoggerMiddleware = (action: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    logger.info(`AUDIT: Action [${action}] initiated by User [${(req as any).user?.id || "ANONYMOUS"}]`);
    next();
  };
};

export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Unhandled Exception: ${err.message}`, { stack: err.stack });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(formatErrorResponse("Internal Server Error", err.message || "Server Error", statusCode, err.stack));
};
