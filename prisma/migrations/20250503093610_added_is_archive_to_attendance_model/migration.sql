/*
  Warnings:

  - Added the required column `isArchived` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "isArchived" BOOLEAN NOT NULL;
