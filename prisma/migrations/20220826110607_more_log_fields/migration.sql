/*
  Warnings:

  - Added the required column `status` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;
