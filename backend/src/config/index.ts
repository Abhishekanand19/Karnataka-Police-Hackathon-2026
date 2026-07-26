import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.X_ZCATALYST_PORT || process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  catalyst: {
    projectId: process.env.CATALYST_PROJECT_ID || "ksp_crimelens_2026",
    environment: process.env.CATALYST_ENVIRONMENT || "development",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
