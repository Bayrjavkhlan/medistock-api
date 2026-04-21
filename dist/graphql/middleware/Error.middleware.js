"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const graphql_1 = require("graphql");
const config_1 = require("../../config");
const errors_1 = require("../../errors");
const errorMiddleware = async (resolve, parent, args, ctx, info) => {
    const startTime = performance.now();
    const operation = info.fieldName;
    const parentType = info.parentType.name;
    try {
        const result = await resolve(parent, args, ctx, info);
        return result;
    }
    catch (error) {
        // TODO send alert notification
        if (error instanceof graphql_1.GraphQLError) {
            if (error.extensions.code === "INTERNAL_SERVER_ERROR") {
                console.log("Report error: ", error);
            }
            throw error;
        }
        const endTime = performance.now();
        const logData = {
            operation,
            parentType,
            args: JSON.stringify(args),
            executionTime: `${(endTime - startTime).toFixed(2)}ms`,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
        };
        if (config_1.env.NODE_ENV !== "local") {
            console.log("Report error: ", logData);
        }
        throw errors_1.Errors.System.INTERNAL_SERVER_ERROR();
    }
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=Error.middleware.js.map