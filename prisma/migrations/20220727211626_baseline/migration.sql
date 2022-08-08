-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "archives" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "data" TEXT NOT NULL,
    "company_id" INTEGER,
    "partner_id" INTEGER,
    "plantation_id" INTEGER,
    "type" VARCHAR(255),
    "keywords" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "cpfcnpj" VARCHAR(255) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255),
    "complement" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "district" VARCHAR(255),
    "cep" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "site" VARCHAR(255),
    "role" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255),
    "api_address" VARCHAR(255),
    "access_token" VARCHAR(255),
    "refresh_token" VARCHAR(255),
    "date_expiration_access_token" TIMESTAMPTZ(6),
    "date_expiration_refresh_token" TIMESTAMPTZ(6),
    "date_activated" TIMESTAMPTZ(6),
    "store_id" VARCHAR(255),
    "logo" TEXT,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "nsid" VARCHAR,
    "nstoken" VARCHAR,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantations" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "trees" VARCHAR(255) NOT NULL,
    "geolocation" JSON NOT NULL,
    "company_id" INTEGER,
    "partner_id" INTEGER,
    "receipts_id" INTEGER,
    "tree_value" VARCHAR(255),
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "plantations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "value" DECIMAL NOT NULL,
    "company_id" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_cpfcnpj_key" ON "companies"("cpfcnpj");
