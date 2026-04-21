import { nonNull, queryField, stringArg } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { SymptomObjectType } from "../types";

export const symptom = queryField("symptom", {
  type: SymptomObjectType,
  args: {
    code: nonNull(stringArg()),
  },
  resolve: async (_parent, { code }, ctx) => {
    const criteria = accessibleBy(ctx.caslAbility, "read", "Symptom");

    const data = await (ctx.prisma as any).symptom.findFirst({
      where: {
        ...criteria,
        code,
      },
      include: {
        medications: {
          include: {
            drug: true,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        tests: {
          include: {
            diagnosticTest: {
              include: {
                hospital: {
                  include: {
                    organization: {
                      include: {
                        address: true,
                      },
                    },
                  },
                },
                assignedDoctor: true,
                timeSlots: {
                  where: { isActive: true },
                  orderBy: { startTime: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw Errors.System.DATA_NOT_FOUND();
    }

    return data;
  },
});
