/*
  Warnings:

  - The primary key for the `archives` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `plantations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `tree_value` column on the `plantations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `receipts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `value` on the `receipts` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "archives" DROP CONSTRAINT "archives_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "keywords" SET DATA TYPE TEXT,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "archives_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "archives_id_seq";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
ADD COLUMN     "percentage" DECIMAL(65,30) NOT NULL DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "cpfcnpj" SET DATA TYPE TEXT,
ALTER COLUMN "street" SET DATA TYPE TEXT,
ALTER COLUMN "number" SET DATA TYPE TEXT,
ALTER COLUMN "complement" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "state" SET DATA TYPE TEXT,
ALTER COLUMN "district" SET DATA TYPE TEXT,
ALTER COLUMN "cep" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "site" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "code" SET DATA TYPE TEXT,
ALTER COLUMN "api_address" SET DATA TYPE TEXT,
ALTER COLUMN "access_token" SET DATA TYPE TEXT,
ALTER COLUMN "refresh_token" SET DATA TYPE TEXT,
ALTER COLUMN "date_expiration_access_token" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "date_expiration_refresh_token" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "date_activated" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "store_id" SET DATA TYPE TEXT,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "nsid" SET DATA TYPE TEXT,
ALTER COLUMN "nstoken" SET DATA TYPE TEXT,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "companies_id_seq";

-- AlterTable
ALTER TABLE "plantations" DROP CONSTRAINT "plantations_pkey",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "external" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "planted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tree_qty" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "trees" SET DATA TYPE TEXT,
ALTER COLUMN "geolocation" SET DATA TYPE JSONB,
DROP COLUMN "tree_value",
ADD COLUMN     "tree_value" DECIMAL(65,30) NOT NULL DEFAULT 25,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "plantations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "plantations_id_seq";

-- AlterTable
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_pkey",
ADD COLUMN     "order_id" TEXT,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vendor" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "receipts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "receipts_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "carbonPercentage" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "company_id" DROP NOT NULL,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateTable
CREATE TABLE "handler" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "tree_qty" INTEGER NOT NULL,

    CONSTRAINT "handler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_archivesToplantations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_archivesTocompanies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_companiesTousers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_companiesToreceipts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_companiesToplantations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_companiesTohandler" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_plantationsToreceipts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_handlerToplantations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_archivesToplantations_AB_unique" ON "_archivesToplantations"("A", "B");

-- CreateIndex
CREATE INDEX "_archivesToplantations_B_index" ON "_archivesToplantations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_archivesTocompanies_AB_unique" ON "_archivesTocompanies"("A", "B");

-- CreateIndex
CREATE INDEX "_archivesTocompanies_B_index" ON "_archivesTocompanies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_companiesTousers_AB_unique" ON "_companiesTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_companiesTousers_B_index" ON "_companiesTousers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_companiesToreceipts_AB_unique" ON "_companiesToreceipts"("A", "B");

-- CreateIndex
CREATE INDEX "_companiesToreceipts_B_index" ON "_companiesToreceipts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_companiesToplantations_AB_unique" ON "_companiesToplantations"("A", "B");

-- CreateIndex
CREATE INDEX "_companiesToplantations_B_index" ON "_companiesToplantations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_companiesTohandler_AB_unique" ON "_companiesTohandler"("A", "B");

-- CreateIndex
CREATE INDEX "_companiesTohandler_B_index" ON "_companiesTohandler"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_plantationsToreceipts_AB_unique" ON "_plantationsToreceipts"("A", "B");

-- CreateIndex
CREATE INDEX "_plantationsToreceipts_B_index" ON "_plantationsToreceipts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_handlerToplantations_AB_unique" ON "_handlerToplantations"("A", "B");

-- CreateIndex
CREATE INDEX "_handlerToplantations_B_index" ON "_handlerToplantations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "_archivesToplantations" ADD CONSTRAINT "_archivesToplantations_A_fkey" FOREIGN KEY ("A") REFERENCES "archives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_archivesToplantations" ADD CONSTRAINT "_archivesToplantations_B_fkey" FOREIGN KEY ("B") REFERENCES "plantations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_archivesTocompanies" ADD CONSTRAINT "_archivesTocompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "archives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_archivesTocompanies" ADD CONSTRAINT "_archivesTocompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesTousers" ADD CONSTRAINT "_companiesTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesTousers" ADD CONSTRAINT "_companiesTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesToreceipts" ADD CONSTRAINT "_companiesToreceipts_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesToreceipts" ADD CONSTRAINT "_companiesToreceipts_B_fkey" FOREIGN KEY ("B") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesToplantations" ADD CONSTRAINT "_companiesToplantations_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesToplantations" ADD CONSTRAINT "_companiesToplantations_B_fkey" FOREIGN KEY ("B") REFERENCES "plantations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesTohandler" ADD CONSTRAINT "_companiesTohandler_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_companiesTohandler" ADD CONSTRAINT "_companiesTohandler_B_fkey" FOREIGN KEY ("B") REFERENCES "handler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_plantationsToreceipts" ADD CONSTRAINT "_plantationsToreceipts_A_fkey" FOREIGN KEY ("A") REFERENCES "plantations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_plantationsToreceipts" ADD CONSTRAINT "_plantationsToreceipts_B_fkey" FOREIGN KEY ("B") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_handlerToplantations" ADD CONSTRAINT "_handlerToplantations_A_fkey" FOREIGN KEY ("A") REFERENCES "handler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_handlerToplantations" ADD CONSTRAINT "_handlerToplantations_B_fkey" FOREIGN KEY ("B") REFERENCES "plantations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
