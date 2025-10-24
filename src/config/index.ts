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
  GRAPHQL_PATH: process.env.GRAPHQL_PATH || "/api/graphql",
  CORS_DOMAIN: process.env.CORS_DOMAIN?.trim().split(",") || [
    "http://localhost:3000",
  ],
};
