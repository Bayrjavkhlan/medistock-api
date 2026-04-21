import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const pagination: (take: number, page: number) => {
    take: number;
    skip: number;
};
type SortDirection = "asc" | "desc";
type ManualSorter = {
    [key: string]: SortDirection;
};
type NullableSortInput = {
    [key: string]: SortDirection | null | undefined;
} | null | undefined;
export declare const buildOrderBy: <T>({ orderBy, manual, }: {
    orderBy?: NullableSortInput;
    manual?: ManualSorter;
}) => {
    orderBy: T[];
};
export {};
//# sourceMappingURL=index.d.ts.map