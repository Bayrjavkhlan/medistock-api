import { inputObjectType } from "nexus";

export const LoginInput = inputObjectType({
  name: "LoginInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("password");
  },
});

export const SignUpInput = inputObjectType({
  name: "SignUpInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("name");
  },
});

export const VerifyOtpInput = inputObjectType({
  name: "VerifyOtpInput",
  definition: (t) => {
    t.nonNull.string("email");
    t.nonNull.string("otp");
  },
});

export const ResendOtpInput = inputObjectType({
  name: "ResendOtpInput",
  definition: (t) => {
    t.nonNull.string("email");
  },
});
