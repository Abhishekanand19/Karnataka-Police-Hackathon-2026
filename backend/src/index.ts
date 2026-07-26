import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { logger } from "./logger";
import {
  requestLoggerMiddleware,
  catalystInitMiddleware,
  globalErrorHandler,
} from "./middleware";
import apiRoutes from "./routes";

const app = express();

// Security & Middlewares
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging & Auth Context
app.use(requestLoggerMiddleware);
app.use(catalystInitMiddleware);

// Mount API Routes
app.use("/api", apiRoutes);

// Root Health Route
app.get("/", (_req, res) => {
  res.status(200).json({
    name: "CrimeLens AI Backend",
    status: "Operational",
    version: "1.0.0",
    api: "/api"
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, "0.0.0.0", () => {
    logger.info(`CrimeLens AI Backend Service listening on port ${config.port}`);
    logger.info(`Environment: [${config.nodeEnv}] | Catalyst Project: [${config.catalyst.projectId}]`);
  });
}

export default app;
