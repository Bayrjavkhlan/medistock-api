import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../graphql/context";
type ResolverMiddleware = (resolve: any, parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) => Promise<any>;
export declare const errorMiddleware: ResolverMiddleware;
export {};
//# sourceMappingURL=Error.middleware.d.ts.map