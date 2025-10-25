import { makeSchema } from "nexus";
import { join } from "path";
import * as resolvers from "./resolver";

const schema = makeSchema({
  types: [resolvers],
  outputs: {
    typegen: join(process.cwd(), "./src/graphql/generated", "nexus-typegen.ts"),
    schema: join(process.cwd(), "./src/graphql/generated", "schema.graphql"),
  },
  contextType: {
    module: join(process.cwd(), "./src/graphql", "/context.ts"),
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

export { schema };
