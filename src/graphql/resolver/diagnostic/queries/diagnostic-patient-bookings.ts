import { queryField } from "nexus";

import { Errors } from "@/errors";
import { accessibleBy } from "@/lib/casl";

import { DiagnosticPatientBookingListPayload } from "../types";

export const diagnosticPatientBookings = queryField(
  "diagnosticPatientBookings",
  {
    type: DiagnosticPatientBookingListPayload,
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.reqUser?.user) {
        throw Errors.Auth.NOT_AUTHORIZED();
      }

      const criteria = accessibleBy(ctx.caslAbility, "read", "Booking");

      const data = await (ctx.prisma as any).booking.findMany({
        where: {
          ...criteria,
          type: "DIAGNOSTIC_TEST",
          patientUserId: ctx.reqUser.user.id,
        },
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
          diagnosticTest: {
            include: {
              assignedDoctor: true,
              timeSlots: true,
            },
          },
          diagnosticTimeSlot: true,
        },
        orderBy: [{ bookingTime: "asc" }, { createdAt: "desc" }],
      });

      return {
        data,
        count: data.length,
      };
    },
  }
);
