DO $$
BEGIN
  ALTER TYPE "OrganizationType" ADD VALUE 'SUPPLIER';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "SupplierStatus" AS ENUM ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "SupplyItemCategory" AS ENUM (
    'LAB_ANALYZER',
    'LAB_CONSUMABLE',
    'IMAGING_SYSTEM',
    'PATIENT_MONITORING',
    'SURGICAL_SUPPLY',
    'DIAGNOSTIC_DEVICE',
    'ICU_SUPPORT',
    'STERILIZATION',
    'HOSPITAL_FURNITURE',
    'PPE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "SupplyAvailabilityStatus" AS ENUM (
    'AVAILABLE',
    'LIMITED',
    'OUT_OF_STOCK',
    'PREORDER',
    'DISCONTINUED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Supplier" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "description" TEXT,
  "logoUrl" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "website" TEXT,
  "status" "SupplierStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SupplyItem" (
  "id" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "shortDescription" TEXT,
  "description" TEXT,
  "category" "SupplyItemCategory" NOT NULL,
  "model" TEXT,
  "brand" TEXT,
  "manufacturer" TEXT,
  "price" DOUBLE PRECISION,
  "currency" TEXT DEFAULT 'USD',
  "availability" "SupplyAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
  "warranty" TEXT,
  "contactInfo" TEXT,
  "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "documentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "specifications" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SupplyItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Supplier_organizationId_key" ON "Supplier"("organizationId");
CREATE INDEX IF NOT EXISTS "SupplyItem_supplierId_idx" ON "SupplyItem"("supplierId");
CREATE INDEX IF NOT EXISTS "SupplyItem_category_idx" ON "SupplyItem"("category");
CREATE INDEX IF NOT EXISTS "SupplyItem_availability_idx" ON "SupplyItem"("availability");

DO $$
BEGIN
  ALTER TABLE "Supplier"
    ADD CONSTRAINT "Supplier_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "SupplyItem"
    ADD CONSTRAINT "SupplyItem_supplierId_fkey"
    FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
