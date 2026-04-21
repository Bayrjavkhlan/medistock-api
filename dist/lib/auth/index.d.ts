import { Response } from "express";
import jwt from "jsonwebtoken";
export type TokenPayload = {
    userId: string;
    refreshToken?: string | undefined;
};
export type LoginPayload = {
    jwtid: string;
    accessToken: string;
    refreshToken: string;
};
export declare const generateAccessToken: (userId: string) => Promise<LoginPayload>;
export declare const verifyAccessToken: (token: string) => TokenPayload & jwt.JwtPayload;
export declare const setAuthCookies: (res: Response, secure: boolean, accessToken: string) => void;
export declare const clearAuthCookies: (res: Response) => void;
//# sourceMappingURL=index.d.ts.map