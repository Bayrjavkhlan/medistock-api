import { type IRule, rule } from "graphql-shield";

import { SystemErrors } from "@/errors/system";
import type { Context } from "@/graphql/context";

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;

const getBucket = (key: string) => {
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

export const rateLimit = (userLimit = 100, globalLimit = 10_000): IRule => {
  return rule({ cache: "no_cache" })((_parent, _args, ctx: Context, info) => {
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
      throw SystemErrors.TOO_MANY_REQUESTS();
    }

    return true;
  });
};

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 10 * 60_000).unref();
