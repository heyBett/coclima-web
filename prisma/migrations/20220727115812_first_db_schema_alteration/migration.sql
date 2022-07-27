/*
  Warnings:

  - The primary key for the `archives` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `plantations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `receipts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `access_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "archives" DROP CONSTRAINT "archives_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "archives_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "archives_id_seq";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
ADD COLUMN     "nsid" VARCHAR,
ADD COLUMN     "nstoken" VARCHAR,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "companies_id_seq";

-- AlterTable
ALTER TABLE "plantations" DROP CONSTRAINT "plantations_pkey",
ADD COLUMN     "planted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "plantations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "plantations_id_seq";

-- AlterTable
ALTER TABLE "receipts" DROP CONSTRAINT "receipts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "receipts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "receipts_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "access_token",
DROP COLUMN "store_id",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
