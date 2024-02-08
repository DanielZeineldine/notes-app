/*
  Warnings:

  - You are about to drop the column `authorId` on the `Note` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_authorId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "authorId";
