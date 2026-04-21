"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicateUser = checkDuplicateUser;
async function checkDuplicateUser(prisma, email, phone) {
    if (!email && !phone)
        return null;
    const orConditions = [
        email ? { email } : undefined,
        phone ? { phone } : undefined,
    ].filter(Boolean);
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: orConditions,
        },
    });
    return existingUser;
}
//# sourceMappingURL=checkDuplicateStaff.js.map