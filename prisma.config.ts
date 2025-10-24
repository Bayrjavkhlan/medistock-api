import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
