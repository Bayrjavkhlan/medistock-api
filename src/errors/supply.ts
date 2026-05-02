import { GraphQLError } from "graphql";

export const SupplyErrorMap = {
  SUPPLY_ITEM_NOT_FOUND: {
    code: "SUPPLY_ITEM_NOT_FOUND",
    message: "Нийлүүлэлтийн бүртгэл олдсонгүй",
  },
};

export const SupplyErrors = {
  SUPPLY_ITEM_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(SupplyErrorMap.SUPPLY_ITEM_NOT_FOUND.message, {
      extensions: SupplyErrorMap.SUPPLY_ITEM_NOT_FOUND,
    }),
};
