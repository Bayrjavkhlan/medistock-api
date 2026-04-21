import { inputObjectType } from "nexus";

export const LoginInput = inputObjectType({
  name: "LoginInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const RegisterInput = inputObjectType({
  name: "RegisterInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("name");
    t.string("phone");
  },
});
