import { NexusGenFieldTypes } from "../../graphql/generated/nexus-typegen";
type Permissions = {
    [K in "Query" | "Mutation"]?: {
        [P in keyof NexusGenFieldTypes[K]]?: any;
    };
};
declare const permissions: Permissions;
declare const shieldMiddleware: import("graphql-middleware").IMiddlewareGenerator<any, any, any>;
export { permissions, shieldMiddleware };
//# sourceMappingURL=Shield.middleware.d.ts.map