-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "Tracks" DROP CONSTRAINT "Tracks_playlistId_fkey";

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("playlistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracks" ADD CONSTRAINT "Tracks_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("playlistId") ON DELETE RESTRICT ON UPDATE CASCADE;
