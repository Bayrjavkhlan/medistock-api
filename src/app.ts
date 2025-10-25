import express, { Express } from "express";
import cors from "cors";
import { env } from "@/config";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { schema } from "./graphql/schema";
import { prisma } from "./graphql/context";

import { expressMiddleware } from "@as-integrations/express5";
const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: env.CORS_DOMAIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

const httpServer = createServer(app);

const server = new ApolloServer({
  schema: schema,
});

server.start().then(() => {
  app.use(
    env.GRAPHQL_PATH,
    cors<cors.CorsRequest>(corsOptions),
    express.json({ limit: "20mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ prisma, req, res }),
    })
  );
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(env.PORT, () => {
  console.log("------------------|BACKEND-SERVER|----------------");
  console.log(
    `🚀 Graphql server ready at http://localhost:${env.PORT}${env.GRAPHQL_PATH}`
  );
  console.log(`🦄 Server ready at http://localhost:${env.PORT}`);
  console.log("--------------------------------------------------");
});
