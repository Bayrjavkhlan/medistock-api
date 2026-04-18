import { randomInt } from "crypto";

import { Errors } from "@/errors";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_VERIFY_ATTEMPTS = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const assertValidName = (name: string): string => {
  const normalizedName = name.trim();
  if (!normalizedName) {
    throw Errors.User.NAME_REQUIRED();
  }

  return normalizedName;
};

export const assertValidEmail = (email: string): string => {
  const normalizedEmail = normalizeEmail(email);
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw Errors.User.INVALID_EMAIL();
  }

  return normalizedEmail;
};

export const assertStrongPassword = (password: string): string => {
  if (!PASSWORD_REGEX.test(password)) {
    throw Errors.User.WEAK_PASSWORD();
  }

  return password;
};

export const generateOtpCode = (): string =>
  randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();

export const buildOtpState = (): {
  otp: string;
  otpExpiry: Date;
  otpAttempts: number;
  otpLastSentAt: Date;
} => {
  const now = Date.now();

  return {
    otp: generateOtpCode(),
    otpExpiry: new Date(now + OTP_EXPIRY_MINUTES * 60 * 1000),
    otpAttempts: 0,
    otpLastSentAt: new Date(now),
  };
};

export const getOtpResendRemainingSeconds = (
  otpLastSentAt: Date | null | undefined
): number => {
  if (!otpLastSentAt) return 0;

  const elapsedSeconds = Math.floor(
    (Date.now() - otpLastSentAt.getTime()) / 1000
  );

  return Math.max(0, OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
};
