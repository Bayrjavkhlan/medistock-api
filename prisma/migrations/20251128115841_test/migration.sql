/*
  Warnings:

  - You are about to drop the column `userId` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Hospital` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_userId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "userId",
ADD COLUMN     "staffId" TEXT;

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
