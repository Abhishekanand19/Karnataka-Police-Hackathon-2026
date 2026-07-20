import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { logger } from "./logger";
import {
  requestLoggerMiddleware,
  authPlaceholderMiddleware,
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
app.use(authPlaceholderMiddleware);

// Mount API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    logger.info(`CrimeLens AI Backend Service listening on http://localhost:${config.port}`);
    logger.info(`Environment: [${config.nodeEnv}] | Catalyst Project: [${config.catalyst.projectId}]`);
  });
}

export default app;
