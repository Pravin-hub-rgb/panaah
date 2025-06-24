/*
  Warnings:

  - You are about to drop the column `fullAddress` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "fullAddress",
DROP COLUMN "pincode";
