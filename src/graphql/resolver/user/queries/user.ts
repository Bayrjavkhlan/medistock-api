import { queryField } from "nexus";
import { UserObjectType } from "../types/object.types";

export const UserDetail = queryField("userDetail", {
  type: UserObjectType,
  resolve: async (_parent, _args, ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: "user-1" },
      include: {
        hospital: true,
        roles: true,
      },
    });
    return user;
  },
});
