import { Snapshot } from "../../generated/prisma";
import prisma from "../lib/prisma";
import { fetchTracks, fetchPlaylistById } from "./playlists";

async function saveSnapshot(
    id: string,
    userId: string,
    accessToken: string,
    snapshotExists: Snapshot | null
) {
    const tracks = await fetchTracks(id, accessToken);
    const playlist = await fetchPlaylistById(id, accessToken);

    if (!tracks || !playlist || !playlist.valid) return null;

    let trackdata = [];
    for (let i = 0; i < tracks.items.length; i++) {
        const item = tracks.items[i];
        const track = item?.track;
        if (!track) continue;

        const artists = track?.artists;
        let artistArr: any = [];

        for (let artist of artists) {
            if (!artists) continue;
            artistArr.push(artist.name)
        }

        const existingTrack = await prisma.track.findFirst({
            where: {
                id: track.id,
            }
        });

        if (!existingTrack) {
            const addedTrack = await prisma.track.create({
                data: {
                    id: track.id,
                    name: track.name,
                    album: track.album.name,
                    imageUrl: track.album.images[0]?.url,
                    artists: artistArr,
                    Playlist: {
                        connect: { playlistId: id }
                    },
                }
            });
            trackdata.push({ ...addedTrack, rank: i + 1 });
        }
        else {
            trackdata.push({ ...existingTrack, rank: i + 1 });
        }
    }

    let snapshot: Snapshot;
    try {
        if (!snapshotExists) {
            snapshot = await prisma.snapshot.create({
                data: {
                    // id: playlist.data.snapshot_id,
                    playlist: {
                        connect: { playlistId: id }
                    },
                    // tracks: {
                    //     connect: snapshotTrackData.map(snaptrack => ({ id: snaptrack.id }))
                    // },
                    user: {
                        connect: { id: userId }
                    },
                }
            });
            const snapshotTracks = await prisma.snapshotTrack.createMany({
                data: trackdata.map((track, index) => ({
                    snapshotId: snapshot.id,
                    trackId: track.id,
                    rank: track.rank // index + 1
                })),
                skipDuplicates: true,
            });
        }
        else {
            snapshot = snapshotExists;
        }
        return snapshot;
    } catch (error) {
        console.error("Error saving snapshot:", error);
        throw new Error("Error saving snapshot:" + error);
    }

}
export { saveSnapshot };