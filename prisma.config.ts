import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  schema: path.join("prisma/schema", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  views: {
    path: path.join("prisma", "views"),
  },
  typedSql: {
    path: path.join("prisma", "queries"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
