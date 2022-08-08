/*
  Warnings:

  - You are about to drop the column `tree_qty` on the `handler` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "handler" DROP COLUMN "tree_qty";

-- AlterTable
ALTER TABLE "plantations" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
