import { PrismaClient, User } from "@prisma/client";
export declare function checkDuplicateUser(prisma: PrismaClient, email?: string, phone?: string): Promise<User | null>;
//# sourceMappingURL=checkDuplicateStaff.d.ts.map