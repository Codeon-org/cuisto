/*
  Warnings:

  - You are about to drop the column `deviceToken` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `deviceFingerprint` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RefreshToken_deviceToken_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "deviceToken",
ADD COLUMN     "deviceFingerprint" TEXT NOT NULL;
