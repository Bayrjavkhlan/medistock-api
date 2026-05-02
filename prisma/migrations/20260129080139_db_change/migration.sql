/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `EquipmentLog` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `EquipmentLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EquipmentLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `EquipmentLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToStaff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performedById` to the `EquipmentLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'LOW', 'OUT_OF_STOCK', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('HOSPITAL', 'PHARMACY');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_staffId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToStaff" DROP CONSTRAINT "_RoleToStaff_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToStaff" DROP CONSTRAINT "_RoleToStaff_B_fkey";

-- DropIndex
DROP INDEX "Address_hospitalId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "createdBy",
DROP COLUMN "hospitalId",
DROP COLUMN "updatedBy",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "createdBy",
DROP COLUMN "staffId",
DROP COLUMN "updatedBy",
ADD COLUMN     "assignedToId" TEXT;

-- AlterTable
ALTER TABLE "EquipmentLog" DROP COLUMN "createdBy",
DROP COLUMN "staffId",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD COLUMN     "performedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "createdBy",
DROP COLUMN "name",
DROP COLUMN "updatedBy",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Staff";

-- DropTable
DROP TABLE "_RoleToStaff";

-- DropEnum
DROP TYPE "EnumStaffRole";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "doctorName" TEXT,
    "bookingTime" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "dosageForm" TEXT,
    "strength" TEXT,
    "manufacturer" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PharmacyDrug" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION,
    "status" "InventoryStatus" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyDrug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "name" TEXT,
    "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drug_name_strength_dosageForm_key" ON "Drug"("name", "strength", "dosageForm");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyDrug_pharmacyId_drugId_key" ON "PharmacyDrug"("pharmacyId", "drugId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_organizationId_key" ON "Pharmacy"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_organizationId_key" ON "Address"("organizationId");

-- CreateIndex
CREATE INDEX "Address_latitude_longitude_idx" ON "Address"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_organizationId_key" ON "Hospital"("organizationId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLog" ADD CONSTRAINT "EquipmentLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyDrug" ADD CONSTRAINT "PharmacyDrug_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyDrug" ADD CONSTRAINT "PharmacyDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
