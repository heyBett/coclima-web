/*
  Warnings:

  - You are about to drop the column `company_id` on the `plantations` table. All the data in the column will be lost.
  - You are about to drop the column `receipts_id` on the `plantations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "plantations" DROP COLUMN "company_id",
DROP COLUMN "receipts_id",
ALTER COLUMN "partner_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "plantations" ADD CONSTRAINT "plantations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
