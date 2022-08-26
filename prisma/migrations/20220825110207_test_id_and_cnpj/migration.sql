/*
  Warnings:

  - A unique constraint covering the columns `[id,cpfcnpj]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_cnpj_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "companies_id_cpfcnpj_key" ON "companies"("id", "cpfcnpj");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_company_cnpj_fkey" FOREIGN KEY ("company_id", "company_cnpj") REFERENCES "companies"("id", "cpfcnpj") ON DELETE SET NULL ON UPDATE CASCADE;
