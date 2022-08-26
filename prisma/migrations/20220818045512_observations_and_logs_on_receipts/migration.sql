-- AlterTable
ALTER TABLE "receipts" ADD COLUMN     "observations" TEXT;

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Logs_id_key" ON "Logs"("id");

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
