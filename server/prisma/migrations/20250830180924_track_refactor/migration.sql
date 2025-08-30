/*
  Warnings:

  - You are about to drop the column `date` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "date",
DROP COLUMN "month",
DROP COLUMN "year";

-- AlterTable
ALTER TABLE "Tracks" DROP COLUMN "title",
ADD COLUMN     "snapshotId" TEXT,
ALTER COLUMN "album" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tracks" ADD CONSTRAINT "Tracks_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
