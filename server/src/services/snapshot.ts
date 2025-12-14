import { Snapshot } from "../../generated/prisma";
import logger from "../lib/logger";
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

        const addedTrack = await prisma.track.upsert({
            where: {
                id: track.id
            },
            update: {},
            create: {
                id: track.id,
                name: track.name,
                album: track.album.name,
                imageUrl: track.album.images[0]?.url,
                artists: artistArr,
                Playlist: {
                    connectOrCreate: {
                        where: { playlistId: id },
                        create: {
                            playlistId: id,
                            name: playlist.data.name,
                            description: playlist.data.description || '',
                            image: playlist.data.images?.[0]?.url || '',
                            url: playlist.data.external_urls?.spotify || '',
                            snapshotId: playlist.data.snapshot_id,
                        }
                    }
                },
            }
        });
        trackdata.push({ ...addedTrack, rank: i + 1 });
    }

    let snapshot: Snapshot;
    try {
        if (!snapshotExists) {
            snapshot = await prisma.snapshot.create({
                data: {
                    playlist: {
                        connect: { playlistId: id }
                    },
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
        logger.error("Error saving snapshot:", error);
        throw new Error("Error saving snapshot:" + error);
    }

}
export { saveSnapshot };