/*
  Warnings:

  - You are about to drop the column `rank` on the `Tracks` table. All the data in the column will be lost.
  - You are about to drop the column `snapshotId` on the `Tracks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tracks" DROP CONSTRAINT "Tracks_snapshotId_fkey";

-- AlterTable
ALTER TABLE "Tracks" DROP COLUMN "rank",
DROP COLUMN "snapshotId";

-- CreateTable
CREATE TABLE "SnapshotTracks" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnapshotTracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotTracks_snapshotId_trackId_key" ON "SnapshotTracks"("snapshotId", "trackId");

-- AddForeignKey
ALTER TABLE "SnapshotTracks" ADD CONSTRAINT "SnapshotTracks_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotTracks" ADD CONSTRAINT "SnapshotTracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
