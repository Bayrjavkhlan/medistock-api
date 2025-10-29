import { GraphQLScalarType } from "graphql";
import {
  JSONResolver,
  DateTimeResolver,
  EmailAddressResolver,
} from "graphql-scalars";
import { asNexusMethod } from "nexus";

const ScalarJson = new GraphQLScalarType(JSONResolver);
const ScalarDateTime = new GraphQLScalarType(DateTimeResolver);
const ScalarEmail = new GraphQLScalarType(EmailAddressResolver);

export const ScalarTypes = [
  asNexusMethod(ScalarJson, "json"),
  asNexusMethod(ScalarDateTime, "dateTime"),
  asNexusMethod(ScalarEmail, "email"),
];
