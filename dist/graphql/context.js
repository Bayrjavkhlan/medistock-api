"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.findRequestUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const errors_1 = require("../errors");
const withOrg_1 = require("../graphql/middleware/withOrg");
const auth_1 = require("../lib/auth");
const casl_1 = require("../lib/casl");
const prisma_1 = require("../lib/prisma");
const verifyToken = (req) => {
    const headerToken = req.headers.authorization && req.headers.authorization.split("Bearer ")[1];
    const token = req.cookies[config_1.env.AUTH_TOKEN_KEY] || headerToken;
    if (token) {
        try {
            const { userId } = (0, auth_1.verifyAccessToken)(token);
            return userId;
        }
        catch (error) {
            const tokenExpires = error instanceof jsonwebtoken_1.TokenExpiredError;
            if (tokenExpires)
                throw errors_1.Errors.Auth.ACCESS_TOKEN_EXPIRED();
            throw errors_1.Errors.Auth.INVALID_ACCESS_TOKEN();
        }
    }
    return undefined;
};
const findRequestUser = async (userId) => {
    if (!userId)
        return null;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            memberships: {
                include: {
                    organization: {
                        include: {
                            hospital: true,
                            pharmacy: true,
                        },
                    },
                },
            },
        },
    });
    if (!user)
        return null;
    if (user.isPlatformAdmin && user.memberships.length === 0) {
        const organizations = await prisma_1.prisma.organization.findMany({
            include: {
                hospital: true,
                pharmacy: true,
            },
            orderBy: { createdAt: "asc" },
        });
        return {
            user: {
                ...user,
                memberships: organizations.map((organization) => ({
                    role: client_1.OrganizationRole.OWNER,
                    organization,
                })),
            },
        };
    }
    return {
        user,
    };
};
exports.findRequestUser = findRequestUser;
const createContext = async ({ req, res }) => {
    const userId = verifyToken(req);
    const reqUser = await (0, exports.findRequestUser)(userId);
    const activeOrg = (0, withOrg_1.resolveActiveOrg)(req, reqUser);
    const caslAbility = (0, casl_1.createAbilities)({ reqUser, activeOrg });
    return {
        req,
        res,
        prisma: prisma_1.prisma,
        reqUser,
        activeOrg,
        caslAbility,
    };
};
exports.createContext = createContext;
//# sourceMappingURL=context.js.map