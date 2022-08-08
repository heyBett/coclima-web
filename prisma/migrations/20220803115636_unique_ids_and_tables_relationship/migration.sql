/*
  Warnings:

  - You are about to drop the `_companiesToreceipts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_companiesTousers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_handlerToplantations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_plantationsToreceipts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `archives` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `handler` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `plantations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `receipts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `company_id` on table `receipts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_companiesToreceipts" DROP CONSTRAINT "_companiesToreceipts_A_fkey";

-- DropForeignKey
ALTER TABLE "_companiesToreceipts" DROP CONSTRAINT "_companiesToreceipts_B_fkey";

-- DropForeignKey
ALTER TABLE "_companiesTousers" DROP CONSTRAINT "_companiesTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_companiesTousers" DROP CONSTRAINT "_companiesTousers_B_fkey";

-- DropForeignKey
ALTER TABLE "_handlerToplantations" DROP CONSTRAINT "_handlerToplantations_A_fkey";

-- DropForeignKey
ALTER TABLE "_handlerToplantations" DROP CONSTRAINT "_handlerToplantations_B_fkey";

-- DropForeignKey
ALTER TABLE "_plantationsToreceipts" DROP CONSTRAINT "_plantationsToreceipts_A_fkey";

-- DropForeignKey
ALTER TABLE "_plantationsToreceipts" DROP CONSTRAINT "_plantationsToreceipts_B_fkey";

-- AlterTable
ALTER TABLE "handler" ADD COLUMN     "plantation_id" TEXT;

-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "plantation_id" TEXT,
ALTER COLUMN "company_id" SET NOT NULL,
ALTER COLUMN "company_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "company_id" SET NOT NULL,
ALTER COLUMN "company_id" SET DATA TYPE TEXT,
ALTER COLUMN "image" SET DEFAULT '/images/default_users.jpg';

-- DropTable
DROP TABLE "_companiesToreceipts";

-- DropTable
DROP TABLE "_companiesTousers";

-- DropTable
DROP TABLE "_handlerToplantations";

-- DropTable
DROP TABLE "_plantationsToreceipts";

-- CreateIndex
CREATE UNIQUE INDEX "archives_id_key" ON "archives"("id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_id_key" ON "companies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "handler_id_key" ON "handler"("id");

-- CreateIndex
CREATE UNIQUE INDEX "plantations_id_key" ON "plantations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_id_key" ON "receipts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "handler" ADD CONSTRAINT "handler_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
