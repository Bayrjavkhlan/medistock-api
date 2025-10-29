import { checkDuplicateUser } from "@/utils/checkDuplicateUser";
import { generatePassword } from "@/utils/generatePassword";
import { mutationField, nonNull } from "nexus";

export const userCreate = mutationField("userCreate", {
  type: "Boolean",
  args: {
    input: nonNull("UserCreateInput"),
  },
  resolve: async (_, { input }, ctx) => {
    const { name, email, phone, roleKeys, hospitalId } = input;

    const existingUser = await checkDuplicateUser(ctx.prisma, email, phone);
    if (existingUser) {
      throw new Error("User with this email or phone already exists.");
    }

    const { passwordHashed } = generatePassword(email);

    const data: any = {
      name,
      email,
      phone,
      password: passwordHashed,
      roles: {
        connect: roleKeys.map((key: string) => ({ key })),
      },
      ...(hospitalId && { hospital: { connect: { id: hospitalId } } }),
    };

    const userCreated = await ctx.prisma.user.create({ data });
    return !!userCreated;
  },
});
