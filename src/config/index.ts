import "dotenv/config";

const constants = {
  DEFAULT_PASSWORD: "A1234",
  AUTH_TOKEN_EXPIRE: 24 * 3600 * 1000,
  REFRESH_TOKEN_EXPIRE: "7d",
  AUTH_TOKEN_KEY: "auth-token",
  REFRESH_TOKEN_KEY: "refresh-token",
};

export const env = {
  ...constants,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "medistock-secret-key",
  GRAPHQL_PATH: process.env.GRAPHQL_PATH || "/api/graphql",
  CORS_DOMAIN: process.env.CORS_DOMAIN?.trim().split(",") || [
    "http://localhost:3000",
  ],
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN?.trim() || undefined,
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "noreply@medistock.com",
};
