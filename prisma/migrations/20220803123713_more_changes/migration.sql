/*
  Warnings:

  - You are about to drop the column `company_id` on the `archives` table. All the data in the column will be lost.
  - You are about to drop the `_archivesTocompanies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_archivesToplantations` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `partner_id` on table `archives` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plantation_id` on table `archives` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_archivesTocompanies" DROP CONSTRAINT "_archivesTocompanies_A_fkey";

-- DropForeignKey
ALTER TABLE "_archivesTocompanies" DROP CONSTRAINT "_archivesTocompanies_B_fkey";

-- DropForeignKey
ALTER TABLE "_archivesToplantations" DROP CONSTRAINT "_archivesToplantations_A_fkey";

-- DropForeignKey
ALTER TABLE "_archivesToplantations" DROP CONSTRAINT "_archivesToplantations_B_fkey";

-- AlterTable
ALTER TABLE "archives" DROP COLUMN "company_id",
ALTER COLUMN "partner_id" SET NOT NULL,
ALTER COLUMN "partner_id" SET DATA TYPE TEXT,
ALTER COLUMN "plantation_id" SET NOT NULL,
ALTER COLUMN "plantation_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_archivesTocompanies";

-- DropTable
DROP TABLE "_archivesToplantations";

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
