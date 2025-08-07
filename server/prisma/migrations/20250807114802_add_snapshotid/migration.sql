/*
  Warnings:

  - You are about to drop the column `slug` on the `Playlists` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Tracks` table. All the data in the column will be lost.
  - You are about to drop the `SnapshotDates` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `SnapshotId` to the `Playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlistId` to the `Playlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Playlists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SnapshotDates" DROP CONSTRAINT "SnapshotDates_playlistId_fkey";

-- DropIndex
DROP INDEX "Playlists_slug_key";

-- DropIndex
DROP INDEX "Tracks_slug_key";

-- AlterTable
ALTER TABLE "Playlists" DROP COLUMN "slug",
ADD COLUMN     "SnapshotId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT[],
ADD COLUMN     "playlistId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tracks" DROP COLUMN "slug";

-- DropTable
DROP TABLE "SnapshotDates";

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
