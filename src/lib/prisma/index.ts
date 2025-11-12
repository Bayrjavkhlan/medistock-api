import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const pagination = (
  take: number,
  page: number
): { take: number; skip: number } => ({
  take,
  skip: page * take,
});

type SortDirection = "asc" | "desc";

type ManualSorter = {
  [key: string]: SortDirection;
};

type NullableSortInput =
  | {
      [key: string]: SortDirection | null | undefined;
    }
  | null
  | undefined;

export const buildOrderBy = <T>({
  orderBy,
  manual,
}: {
  orderBy?: NullableSortInput;
  manual?: ManualSorter;
}): { orderBy: T[] } => {
  const inputOrder =
    orderBy && Object.entries(orderBy).length > 0
      ? orderBy
      : manual || { createdAt: "desc" };

  const orderByMap = Object.entries(inputOrder).map(([key, val]) => ({
    [key]: val,
  })) as T[];

  return { orderBy: orderByMap };
};
