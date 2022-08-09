-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "archives" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "data" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "plantation_id" TEXT NOT NULL,
    "type" TEXT,
    "keywords" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thumbnail" TEXT,

    CONSTRAINT "archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpfcnpj" TEXT,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "city" TEXT,
    "state" TEXT,
    "district" TEXT,
    "cep" TEXT,
    "phone" TEXT NOT NULL,
    "site" TEXT,
    "role" TEXT NOT NULL,
    "code" TEXT,
    "api_address" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "date_expiration_access_token" TIMESTAMP(3),
    "date_expiration_refresh_token" TIMESTAMP(3),
    "date_activated" TIMESTAMP(3),
    "store_id" TEXT,
    "logo" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nsid" TEXT,
    "nstoken" TEXT,
    "percentage" DECIMAL(65,30) NOT NULL DEFAULT 1,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantations" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geolocation" JSONB NOT NULL,
    "partner_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "external" TEXT,
    "observations" TEXT,
    "planted" BOOLEAN NOT NULL DEFAULT false,
    "tree_value" INTEGER NOT NULL DEFAULT 2500,

    CONSTRAINT "plantations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handler" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "plantation_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "handler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "company_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "vendor" TEXT,
    "plantation_id" TEXT,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carbonPercentage" INTEGER NOT NULL DEFAULT 2,
    "image" TEXT DEFAULT '/images/default_user.jpg',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "archives_id_key" ON "archives"("id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_id_key" ON "companies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cpfcnpj_key" ON "companies"("cpfcnpj");

-- CreateIndex
CREATE UNIQUE INDEX "plantations_id_key" ON "plantations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "handler_id_key" ON "handler"("id");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_id_key" ON "receipts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archives" ADD CONSTRAINT "archives_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plantations" ADD CONSTRAINT "plantations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handler" ADD CONSTRAINT "handler_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handler" ADD CONSTRAINT "handler_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_plantation_id_fkey" FOREIGN KEY ("plantation_id") REFERENCES "plantations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
