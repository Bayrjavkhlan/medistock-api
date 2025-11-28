/*
  Warnings:

  - You are about to drop the column `userId` on the `EquipmentLog` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staffId` to the `EquipmentLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `key` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnumStaffRole" AS ENUM ('ADMIN', 'HOSPITAL_ADMIN', 'STAFF');

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_userId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- AlterTable
ALTER TABLE "EquipmentLog" DROP COLUMN "userId",
ADD COLUMN     "staffId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "key",
ADD COLUMN     "key" "EnumStaffRole" NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_RoleToUser";

-- DropEnum
DROP TYPE "EnumUserRole";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "hospitalId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToStaff" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToStaff_AB_unique" ON "_RoleToStaff"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToStaff_B_index" ON "_RoleToStaff"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLog" ADD CONSTRAINT "EquipmentLog_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToStaff" ADD CONSTRAINT "_RoleToStaff_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToStaff" ADD CONSTRAINT "_RoleToStaff_B_fkey" FOREIGN KEY ("B") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
