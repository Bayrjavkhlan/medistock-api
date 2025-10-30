import { makeSchema } from "nexus";
import { join } from "path";

import * as resolvers from "./resolver";
import * as types from "./typedef";

const schema = makeSchema({
  types: [resolvers, types],
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
