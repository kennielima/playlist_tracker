/*
  Warnings:

  - You are about to drop the column `SnapshotId` on the `Playlists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlistId]` on the table `Playlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `snapshotId` to the `Playlists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlists" DROP COLUMN "SnapshotId",
ADD COLUMN     "snapshotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlists_playlistId_key" ON "Playlists"("playlistId");
