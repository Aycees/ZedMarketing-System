/*
  Warnings:

  - You are about to drop the column `isArchive` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "isArchive",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
