"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./lib/dayjs");
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const express5_1 = require("@as-integrations/express5");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = require("http");
const config_1 = require("./config");
const errors_1 = require("./errors");
const context_1 = require("./graphql/context");
const schema_1 = require("./graphql/schema");
const logger_1 = require("./lib/logger");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: config_1.env.CORS_DOMAIN,
    credentials: true,
};
if (config_1.env.NODE_ENV !== "local")
    app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "20mb" }));
app.use((0, cookie_parser_1.default)());
app.disable("x-powered-by");
app.use("/", routes_1.default);
const httpServer = (0, http_1.createServer)(app);
const server = new server_1.ApolloServer({
    schema: schema_1.schemaWithMiddleware,
    plugins: [
        {
            async serverWillStart() {
                return {
                    async serverWillStop() {
                        logger_1.Logger.emerg(`[Server stop]`);
                    },
                };
            },
        },
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        config_1.env.NODE_ENV === "production"
            ? (0, default_1.ApolloServerPluginLandingPageProductionDefault)()
            : (0, default_1.ApolloServerPluginLandingPageLocalDefault)(),
    ],
    formatError: errors_1.formatError,
});
server.start().then(() => {
    app.use(config_1.env.GRAPHQL_PATH, (0, cors_1.default)(corsOptions), express_1.default.json({ limit: "20mb" }), (0, express5_1.expressMiddleware)(server, {
        context: async ({ req, res }) => (0, context_1.createContext)({ req, res }),
    }));
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
httpServer.listen(config_1.env.PORT, () => {
    console.log("------------------|BACKEND-SERVER|----------------");
    console.log(`🚀 Graphql server ready at http://localhost:${config_1.env.PORT}${config_1.env.GRAPHQL_PATH}`);
    console.log(`🦄 Server ready at http://localhost:${config_1.env.PORT}`);
    console.log("--------------------------------------------------");
    logger_1.Logger.info(`[Server start] PORT: ${config_1.env.PORT} GRAPHQL_PATH: ${config_1.env.GRAPHQL_PATH}`);
});
//# sourceMappingURL=app.js.map