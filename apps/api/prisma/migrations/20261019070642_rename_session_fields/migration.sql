-- AlterTable
ALTER TABLE "Session" RENAME COLUMN "refreshTokenId" TO "currentRefreshHash";
ALTER TABLE "Session" RENAME COLUMN "tokenHash" TO "previousRefreshHash";
