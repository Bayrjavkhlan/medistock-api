export declare const OTP_LENGTH = 6;
export declare const OTP_EXPIRY_MINUTES = 10;
export declare const OTP_RESEND_COOLDOWN_SECONDS = 60;
export declare const OTP_MAX_VERIFY_ATTEMPTS = 5;
export declare const normalizeEmail: (email: string) => string;
export declare const assertValidName: (name: string) => string;
export declare const assertValidEmail: (email: string) => string;
export declare const assertStrongPassword: (password: string) => string;
export declare const generateOtpCode: () => string;
export declare const buildOtpState: () => {
    otp: string;
    otpExpiry: Date;
    otpAttempts: number;
    otpLastSentAt: Date;
};
export declare const getOtpResendRemainingSeconds: (otpLastSentAt: Date | null | undefined) => number;
//# sourceMappingURL=credentials.d.ts.map