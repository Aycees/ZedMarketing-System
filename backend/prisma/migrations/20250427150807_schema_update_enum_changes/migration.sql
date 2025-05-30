/*
  Warnings:

  - The values [Present,Absent,Late,HalfDay] on the enum `AttendanceStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Active,Inactive,OnLeave] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [FullTime,PartTime] on the enum `EmployeeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Approved,Rejected,Pending] on the enum `LRStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttendanceStatus_new" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY');
ALTER TABLE "Attendance" ALTER COLUMN "attendanceStatus" TYPE "AttendanceStatus_new" USING ("attendanceStatus"::text::"AttendanceStatus_new");
ALTER TYPE "AttendanceStatus" RENAME TO "AttendanceStatus_old";
ALTER TYPE "AttendanceStatus_new" RENAME TO "AttendanceStatus";
DROP TYPE "AttendanceStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');
ALTER TABLE "Employee" ALTER COLUMN "employeeStatus" TYPE "EmployeeStatus_new" USING ("employeeStatus"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "EmployeeStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeType_new" AS ENUM ('FULL_TIME', 'PART_TIME');
ALTER TABLE "Employee" ALTER COLUMN "employeeType" TYPE "EmployeeType_new" USING ("employeeType"::text::"EmployeeType_new");
ALTER TYPE "EmployeeType" RENAME TO "EmployeeType_old";
ALTER TYPE "EmployeeType_new" RENAME TO "EmployeeType";
DROP TYPE "EmployeeType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LRStatus_new" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');
ALTER TYPE "LRStatus" RENAME TO "LRStatus_old";
ALTER TYPE "LRStatus_new" RENAME TO "LRStatus";
DROP TYPE "LRStatus_old";
COMMIT;
