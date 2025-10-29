import { EnumUserRole } from "@prisma/client";
import { enumType } from "nexus";

export const EnumUserRoleType = enumType({
    
  name: "EnumUserRole",
  members: Object.values(EnumUserRole),
});
