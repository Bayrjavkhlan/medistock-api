import { nonNull, queryField, stringArg } from "nexus";
import { UserObjectType } from "../types/object.types";

export const UserDetail = queryField("userDetail", {
  type: UserObjectType,
  args: { id: nonNull(stringArg()) },
  resolve: async (_parent, _args, ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: _args.id },
      include: { roles: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
    };
  },
});
