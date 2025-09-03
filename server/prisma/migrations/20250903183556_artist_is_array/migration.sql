/*
  Warnings:

  - You are about to drop the column `artist` on the `Tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tracks" DROP COLUMN "artist",
ADD COLUMN     "artists" TEXT[];
