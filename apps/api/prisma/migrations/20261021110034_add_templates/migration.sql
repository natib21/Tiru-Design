-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('NONE', 'ADMIN');

-- CreateEnum
CREATE TYPE "TemplateLanguage" AS ENUM ('AMHARIC', 'ENGLISH', 'BILINGUAL');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "sourceTemplateId" TEXT,
ADD COLUMN     "sourceTemplateVersion" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "platformRole" "PlatformRole" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "ownerWorkspaceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "language" "TemplateLanguage" NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "priceMinor" INTEGER NOT NULL DEFAULT 0,
    "thumbnailKey" TEXT,
    "content" JSONB NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "placeholderKeys" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Template_status_category_idx" ON "Template"("status", "category");

-- CreateIndex
CREATE INDEX "Template_ownerWorkspaceId_idx" ON "Template"("ownerWorkspaceId");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_ownerWorkspaceId_fkey" FOREIGN KEY ("ownerWorkspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
