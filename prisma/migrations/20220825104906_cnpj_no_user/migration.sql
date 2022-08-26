/*
  Warnings:

  - A unique constraint covering the columns `[company_cnpj]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "company_cnpj" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_company_cnpj_key" ON "users"("company_cnpj");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_cnpj_fkey" FOREIGN KEY ("company_cnpj") REFERENCES "companies"("cpfcnpj") ON DELETE SET NULL ON UPDATE CASCADE;
