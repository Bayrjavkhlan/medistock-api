import { hashSync } from "bcrypt";

import { env } from "@/config";

const PASS_LENGTH = 8;
const CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export const generatePassword = (
  email: string
): { password: string; passwordHashed: string } => {
  let password = Array.from(
    { length: PASS_LENGTH },
    () => CHARSET[Math.floor(Math.random() * CHARSET.length)]
  ).join("");

  if (email.includes("@test.com")) password = env.DEFAULT_PASSWORD;

  const passwordHashed = hashSync(password, 10);
  return { password, passwordHashed };
};
