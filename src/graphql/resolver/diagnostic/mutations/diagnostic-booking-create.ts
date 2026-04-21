import { GraphQLError } from "graphql";
import { arg, mutationField, nonNull } from "nexus";

import { Errors } from "@/errors";

import {
  DiagnosticBookingCreateInput,
  DiagnosticBookingObjectType,
} from "../types";

const combineBookingDateTime = (bookingDate: string, time: string) => {
  const date = new Date(bookingDate);
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

export const diagnosticBookingCreate = mutationField(
  "diagnosticBookingCreate",
  {
    type: DiagnosticBookingObjectType,
    args: {
      input: nonNull(arg({ type: DiagnosticBookingCreateInput })),
    },
    resolve: async (_parent, { input }, ctx) => {
      if (!ctx.reqUser?.user) {
        throw Errors.Auth.NOT_AUTHORIZED();
      }

      const diagnosticTest = await (
        ctx.prisma as any
      ).diagnosticTest.findUnique({
        where: { id: input.diagnosticTestId },
        include: {
          hospital: true,
          assignedDoctor: true,
          timeSlots: true,
        },
      });

      if (!diagnosticTest || !diagnosticTest.isActive) {
        throw Errors.System.DATA_NOT_FOUND();
      }

      const timeSlot = diagnosticTest.timeSlots.find(
        (item: any) => item.id === input.diagnosticTimeSlotId && item.isActive
      );

      if (!timeSlot) {
        throw Errors.System.DATA_NOT_FOUND();
      }

      const bookingTime = combineBookingDateTime(
        input.bookingDate,
        timeSlot.startTime
      );
      const bookingWindowEnd = combineBookingDateTime(
        input.bookingDate,
        timeSlot.endTime
      );
      if (bookingTime < new Date()) {
        throw new GraphQLError("Өнгөрсөн цаг дээр захиалга хийх боломжгүй.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const slotBookingsCount = await (ctx.prisma as any).booking.count({
        where: {
          diagnosticTimeSlotId: timeSlot.id,
          bookingTime: {
            gte: bookingTime,
            lt: bookingWindowEnd,
          },
          status: {
            not: "CANCELLED",
          },
        },
      });

      if (slotBookingsCount >= timeSlot.capacity) {
        throw new GraphQLError("Сонгосон цаг дүүрсэн байна.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return (ctx.prisma as any).booking.create({
        data: {
          hospitalId: diagnosticTest.hospitalId,
          patientUserId: ctx.reqUser.user.id,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          department: "Diagnostic",
          doctorName: diagnosticTest.assignedDoctor?.name ?? null,
          bookingTime,
          status: "PENDING",
          type: "DIAGNOSTIC_TEST",
          diagnosticTestId: diagnosticTest.id,
          diagnosticTimeSlotId: timeSlot.id,
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
      });
    },
  }
);
