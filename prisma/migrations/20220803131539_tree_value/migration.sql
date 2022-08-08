/*
  Warnings:

  - You are about to alter the column `tree_value` on the `plantations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "plantations" ALTER COLUMN "tree_value" SET DEFAULT 2500,
ALTER COLUMN "tree_value" SET DATA TYPE INTEGER;
