import "@/lib/dayjs";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { expressMiddleware } from "@as-integrations/express5";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { createServer } from "http";

import { env } from "@/config";

import { createContext } from "./graphql/context";
import { schema } from "./graphql/schema";
import { Logger } from "./lib/logger";
import routes from "./routes";

const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: env.CORS_DOMAIN,
  credentials: true,
};

if (env.NODE_ENV !== "local") app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.disable("x-powered-by");

app.use("/", routes);

const httpServer = createServer(app);

const server = new ApolloServer({
  schema: schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async serverWillStop() {
            Logger.emerg(`[Server stop]`);
          },
        };
      },
    },
    ApolloServerPluginDrainHttpServer({ httpServer }),
    env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault(),
  ],
});

server.start().then(() => {
  app.use(
    env.GRAPHQL_PATH,
    cors<cors.CorsRequest>(corsOptions),
    express.json({ limit: "20mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }) => createContext({ req, res }),
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
  Logger.info(
    `[Server start] PORT: ${env.PORT} GRAPHQL_PATH: ${env.GRAPHQL_PATH}`
  );
});
