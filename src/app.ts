import express, { Express } from "express";
import cors from "cors";
import { env } from "@/config";
import { createServer } from "http";
import cookieParser from "cookie-parser";

const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: env.CORS_DOMAIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

const httpServer = createServer(app);

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
