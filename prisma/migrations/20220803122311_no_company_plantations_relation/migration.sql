/*
  Warnings:

  - You are about to drop the `_companiesToplantations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_companiesToplantations" DROP CONSTRAINT "_companiesToplantations_A_fkey";

-- DropForeignKey
ALTER TABLE "_companiesToplantations" DROP CONSTRAINT "_companiesToplantations_B_fkey";

-- DropTable
DROP TABLE "_companiesToplantations";
