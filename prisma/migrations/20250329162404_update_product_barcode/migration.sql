/*
  Warnings:

  - You are about to drop the column `barCode` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "barCode",
ADD COLUMN     "barcode" TEXT;
