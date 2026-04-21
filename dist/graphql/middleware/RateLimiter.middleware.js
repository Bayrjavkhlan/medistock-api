"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const graphql_shield_1 = require("graphql-shield");
const system_1 = require("../../errors/system");
const buckets = new Map();
const WINDOW_MS = 60_000;
const getBucket = (key) => {
    const now = Date.now();
    const existing = buckets.get(key);
    if (!existing || existing.resetAt <= now) {
        const bucket = { count: 1, resetAt: now + WINDOW_MS };
        buckets.set(key, bucket);
        return bucket;
    }
    existing.count += 1;
    return existing;
};
const rateLimit = (userLimit = 100, globalLimit = 10_000) => {
    return (0, graphql_shield_1.rule)({ cache: "no_cache" })((_parent, _args, ctx, info) => {
        const field = info.fieldName;
        const opType = info.parentType.name;
        const operationKey = `${opType}.${field}`;
        const userId = ctx.reqUser?.user?.id.toString() ?? "anonymous";
        const userKey = `rate:user:${userId}:${operationKey}`;
        const globalKey = `rate:global:${operationKey}`;
        const userBucket = getBucket(userKey);
        const globalBucket = getBucket(globalKey);
        const userExceeded = userId !== "anonymous" && userBucket.count > userLimit;
        const globalExceeded = globalBucket.count > globalLimit;
        if (userExceeded || globalExceeded) {
            throw system_1.SystemErrors.TOO_MANY_REQUESTS();
        }
        return true;
    });
};
exports.rateLimit = rateLimit;
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
        if (bucket.resetAt <= now) {
            buckets.delete(key);
        }
    }
}, 10 * 60_000).unref();
//# sourceMappingURL=RateLimiter.middleware.js.map