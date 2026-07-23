-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "aadhaarFile" TEXT,
ADD COLUMN     "aadhaarName" TEXT,
ADD COLUMN     "aadhaarNo" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "panFile" TEXT,
ADD COLUMN     "panNo" TEXT,
ADD COLUMN     "personalEmail" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "physicallyChallenged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "religion" TEXT;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "schemaName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_schemaName_key" ON "Tenant"("schemaName");
