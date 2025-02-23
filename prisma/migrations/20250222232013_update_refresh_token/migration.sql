/*
  Warnings:

  - Added the required column `city` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "os" TEXT NOT NULL;
