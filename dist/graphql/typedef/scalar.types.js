"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarTypes = void 0;
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const nexus_1 = require("nexus");
const ScalarJson = new graphql_1.GraphQLScalarType(graphql_scalars_1.JSONResolver);
const ScalarDateTime = new graphql_1.GraphQLScalarType(graphql_scalars_1.DateTimeResolver);
const ScalarEmail = new graphql_1.GraphQLScalarType(graphql_scalars_1.EmailAddressResolver);
exports.ScalarTypes = [
    (0, nexus_1.asNexusMethod)(ScalarJson, "json"),
    (0, nexus_1.asNexusMethod)(ScalarDateTime, "dateTime"),
    (0, nexus_1.asNexusMethod)(ScalarEmail, "email"),
];
//# sourceMappingURL=scalar.types.js.map