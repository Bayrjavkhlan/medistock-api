"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaWithMiddleware = exports.schema = void 0;
const graphql_middleware_1 = require("graphql-middleware");
const nexus_1 = require("nexus");
const path_1 = require("path");
const Error_middleware_1 = require("./middleware/Error.middleware");
const Shield_middleware_1 = require("./middleware/Shield.middleware");
const resolvers = __importStar(require("./resolver"));
const types = __importStar(require("./typedef"));
const schema = (0, nexus_1.makeSchema)({
    types: [resolvers, types],
    outputs: {
        typegen: (0, path_1.join)(process.cwd(), "./src/graphql/generated", "nexus-typegen.ts"),
        schema: (0, path_1.join)(process.cwd(), "./src/graphql/generated", "schema.graphql"),
    },
    contextType: {
        module: (0, path_1.join)(process.cwd(), "./src/graphql", "/context.ts"),
        export: "Context",
    },
    sourceTypes: {
        modules: [
            {
                module: "@prisma/client",
                alias: "prismaClient",
            },
        ],
    },
});
exports.schema = schema;
const schemaWithMiddleware = (0, graphql_middleware_1.applyMiddleware)(schema, Error_middleware_1.errorMiddleware, Shield_middleware_1.shieldMiddleware);
exports.schemaWithMiddleware = schemaWithMiddleware;
//# sourceMappingURL=schema.js.map