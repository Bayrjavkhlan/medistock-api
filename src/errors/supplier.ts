import { GraphQLError } from "graphql";

export const SupplierErrorMap = {
  SUPPLIER_NOT_FOUND: {
    code: "SUPPLIER_NOT_FOUND",
    message: "Нийлүүлэгч олдсонгүй",
  },
  DUPLICATE_SUPPLIER: {
    code: "DUPLICATE_SUPPLIER",
    message: "Ижил нэртэй нийлүүлэгч бүртгэлтэй байна",
  },
};

export const SupplierErrors = {
  SUPPLIER_NOT_FOUND: (): GraphQLError =>
    new GraphQLError(SupplierErrorMap.SUPPLIER_NOT_FOUND.message, {
      extensions: SupplierErrorMap.SUPPLIER_NOT_FOUND,
    }),
  DUPLICATE_SUPPLIER: (): GraphQLError =>
    new GraphQLError(SupplierErrorMap.DUPLICATE_SUPPLIER.message, {
      extensions: SupplierErrorMap.DUPLICATE_SUPPLIER,
    }),
};
