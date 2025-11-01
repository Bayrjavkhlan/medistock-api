import { inputObjectType } from "nexus";

export const LoginInput = inputObjectType({
  name: "LoginInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});
