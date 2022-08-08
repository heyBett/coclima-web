/*
  Warnings:

  - You are about to drop the `_companiesTohandler` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `handler` table without a default value. This is not possible if the table is not empty.
  - Made the column `plantation_id` on table `handler` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_companiesTohandler" DROP CONSTRAINT "_companiesTohandler_A_fkey";

-- DropForeignKey
ALTER TABLE "_companiesTohandler" DROP CONSTRAINT "_companiesTohandler_B_fkey";

-- DropForeignKey
ALTER TABLE "handler" DROP CONSTRAINT "handler_plantation_id_fkey";

-- AlterTable
ALTER TABLE "handler" ADD COLUMN     "company_id" TEXT NOT NULL,
ALTER COLUMN "plantation_id" SET NOT NULL;

-- DropTable
DROP TABLE "_companiesTohandler";

-- AddForeignKey
ALTER TABLE "handler" ADD CONSTRAINT "handler_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handler" ADD CONSTRAINT "handler_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
