import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  catalyst: {
    projectId: process.env.CATALYST_PROJECT_ID || "ksp_crimelens_2026",
    clientId: process.env.CATALYST_CLIENT_ID || "cat_client_94102",
    clientSecret: process.env.CATALYST_CLIENT_SECRET || "cat_secret_894102",
    environment: process.env.CATALYST_ENVIRONMENT || "development",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
