import { Prisma, PrismaClient } from "@prisma/client";

type SeedDevice = {
  deviceId: string;
  hospitalId: string;
  prefix: string;
  studyTypes: string[];
  department: string;
  baseFileSize: number;
  hourlyPattern: Record<number, number>;
};

const devices: SeedDevice[] = [
  {
    deviceId: "eq-3",
    hospitalId: "hosp-2",
    prefix: "DEF-656",
    studyTypes: ["Цээжний зураг", "Ясны зураг", "Хэвлийн зураг"],
    department: "Дүрс оношилгоо",
    baseFileSize: 8_500_000,
    hourlyPattern: {
      8: 12,
      9: 25,
      10: 40,
      11: 32,
      12: 14,
      13: 18,
      14: 28,
      15: 22,
      16: 16,
    },
  },
  {
    deviceId: "eq-1",
    hospitalId: "hosp-1",
    prefix: "MAG-AERA",
    studyTypes: ["Тархины MRI", "Нурууны MRI", "Үений MRI"],
    department: "MRI тасаг",
    baseFileSize: 96_000_000,
    hourlyPattern: {
      8: 3,
      9: 7,
      10: 12,
      11: 10,
      12: 5,
      13: 6,
      14: 9,
      15: 8,
      16: 4,
    },
  },
];

const buildRows = () => {
  const rows: Prisma.ImagingStudyImageCreateInput[] = [];
  const start = new Date("2026-05-01T00:00:00.000Z");

  devices.forEach((device) => {
    for (let day = 0; day < 35; day += 1) {
      const currentDay = new Date(start);
      currentDay.setUTCDate(start.getUTCDate() + day);
      const dayMultiplier = day % 7 === 0 ? 0.65 : day % 5 === 0 ? 1.25 : 1;

      Object.entries(device.hourlyPattern).forEach(([hourText, baseCount]) => {
        const hour = Number(hourText);
        const count = Math.max(1, Math.round(baseCount * dayMultiplier));

        for (let index = 0; index < count; index += 1) {
          const captureDateTime = new Date(currentDay);
          captureDateTime.setUTCHours(hour, (index * 3) % 60, 0, 0);

          rows.push({
            imageId: `${device.prefix}-${day + 1}-${hour}-${index + 1}`,
            captureDateTime,
            captureDate: captureDateTime.toISOString().slice(0, 10),
            captureTime: captureDateTime.toISOString().slice(11, 19),
            fileSizeBytes:
              device.baseFileSize + ((day + 1) * 97_531 + index * 13_579),
            studyType: device.studyTypes[(day + index) % device.studyTypes.length],
            department: device.department,
            patientCode: `P-${device.prefix}-${(day * 17 + index) % 48}`,
            device: { connect: { id: device.deviceId } },
            hospital: { connect: { id: device.hospitalId } },
          });
        }
      });
    }
  });

  return rows;
};

export async function seedImagingAnalytics(prisma: PrismaClient) {
  console.log("Seeding imaging analytics...");

  const rows = buildRows();

  await prisma.$transaction(
    rows.map((row) =>
      prisma.imagingStudyImage.upsert({
        where: { imageId: row.imageId },
        create: row,
        update: {
          captureDateTime: row.captureDateTime,
          captureDate: row.captureDate,
          captureTime: row.captureTime,
          fileSizeBytes: row.fileSizeBytes,
          studyType: row.studyType,
          department: row.department,
          patientCode: row.patientCode,
          device: row.device,
          hospital: row.hospital,
        },
      })
    )
  );

  console.log("Imaging analytics seeded successfully.");
}
