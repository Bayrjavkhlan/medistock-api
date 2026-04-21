-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('GENERAL', 'DIAGNOSTIC_TEST');

-- AlterTable
ALTER TABLE "Booking"
ADD COLUMN "patientUserId" TEXT,
ADD COLUMN "type" "BookingType" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN "diagnosticTestId" TEXT,
ADD COLUMN "diagnosticTimeSlotId" TEXT;

-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "relief" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomMedication" (
    "id" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "note" TEXT,
    "linkUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticTest" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "assignedDoctorId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "room" TEXT,
    "contact" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomDiagnosticTest" (
    "id" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,
    "diagnosticTestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomDiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticTimeSlot" (
    "id" TEXT NOT NULL,
    "diagnosticTestId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_code_key" ON "Symptom"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomMedication_symptomId_drugId_key" ON "SymptomMedication"("symptomId", "drugId");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomDiagnosticTest_symptomId_diagnosticTestId_key" ON "SymptomDiagnosticTest"("symptomId", "diagnosticTestId");

-- AddForeignKey
ALTER TABLE "SymptomMedication" ADD CONSTRAINT "SymptomMedication_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomMedication" ADD CONSTRAINT "SymptomMedication_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticTest" ADD CONSTRAINT "DiagnosticTest_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticTest" ADD CONSTRAINT "DiagnosticTest_assignedDoctorId_fkey" FOREIGN KEY ("assignedDoctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomDiagnosticTest" ADD CONSTRAINT "SymptomDiagnosticTest_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomDiagnosticTest" ADD CONSTRAINT "SymptomDiagnosticTest_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticTimeSlot" ADD CONSTRAINT "DiagnosticTimeSlot_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_patientUserId_fkey" FOREIGN KEY ("patientUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_diagnosticTimeSlotId_fkey" FOREIGN KEY ("diagnosticTimeSlotId") REFERENCES "DiagnosticTimeSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
