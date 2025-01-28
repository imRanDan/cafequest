/*
  Warnings:

  - A unique constraint covering the columns `[userId,cafeId]` on the table `SavedCafe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SavedCafe_userId_idx";

-- AlterTable
ALTER TABLE "SavedCafe" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SavedCafe_userId_cafeId_key" ON "SavedCafe"("userId", "cafeId");
