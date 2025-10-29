import { queryField } from "nexus";
import { UsersObjectType } from "../types";

export const Users = queryField("users", {
  type: UsersObjectType,
  resolve: async (_parent, _args, ctx) => {
    const users = await ctx.prisma.user.findMany({
      include: {
        hospital: true,
        roles: true,
      },
    });
    return {
      data: users,
      count: users.length,
    };
  },
});
