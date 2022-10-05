/*
  Warnings:

  - Added the required column `content` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "content" JSONB NOT NULL;
