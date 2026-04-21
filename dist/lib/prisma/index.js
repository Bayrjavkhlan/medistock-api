"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderBy = exports.pagination = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const pagination = (take, page) => ({
    take,
    skip: page * take,
});
exports.pagination = pagination;
const buildOrderBy = ({ orderBy, manual, }) => {
    const inputOrder = orderBy && Object.entries(orderBy).length > 0
        ? orderBy
        : manual || { createdAt: "desc" };
    const orderByMap = Object.entries(inputOrder).map(([key, val]) => ({
        [key]: val,
    }));
    return { orderBy: orderByMap };
};
exports.buildOrderBy = buildOrderBy;
//# sourceMappingURL=index.js.map