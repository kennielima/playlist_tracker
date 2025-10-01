import express, { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { fetchPlaylistById, fetchTracks, saveSnapshot } from "../services/playlists";
import { featuredPlaylists } from "../lib/seededPlaylists";

async function getFeaturedPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        let playlists = [];
        for (let seed of featuredPlaylists) {
            const validated = await fetchPlaylistById(seed.id, accessToken);
            if (validated && validated.valid) {
                const data = validated.data;
                const exists = await prisma.playlist.findUnique({
                    where: {
                        playlistId: data.id,
                    }
                })
                let featuredPlaylist;
                if (!exists) {
                    featuredPlaylist = await prisma.playlist.create({
                        data: {
                            playlistId: data.id,
                            name: data.name,
                            description: data.description,
                            image: data.images[0].url,
                            url: data.external_urls.spotify,
                            snapshotId: data.snapshot_id,
                        }
                    })
                    playlists.push(featuredPlaylist);
                }
                playlists.push(exists);
            } else {
                console.error("Error fetching playlist:", validated);
            }
        }

        return res.status(200).json({ data: playlists });

    } catch (error) {
        console.error("Error fetching featured playlists:", error);
        return res.status(500).json({ error: "Internal server error while fetching featured playlists" });
    }
}

async function getPlaylist(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const id = req.params.id;

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        let playlist;
        const fetchFromDb = await prisma.playlist.findUnique({
            where: {
                playlistId: id,
            }
        })
        if (!fetchFromDb) {
            const fetchFromSpotify = await fetchPlaylistById(id, accessToken);

            if (fetchFromSpotify && fetchFromSpotify.valid) {
                playlist = fetchFromSpotify.data;
            } else {
                return res.status(500).json({ error: "Error fetching playlist from Spotify" });
            }
        } else {
            playlist = fetchFromDb;
        };

        const tracks = await fetchTracks(id, accessToken);

        let trackdata: any[] = [];
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

            trackdata.push({
                imageUrl: track.album.images[0].url,
                trackId: track.id,
                name: track.name,
                artists: artistArr,
                playlistId: id,
                playlist: playlist.name,
                rank: i + 1,
                album: track.album.name
            })
        }
        return res.status(200).json({ data: playlist, tracks: trackdata });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching playlist:" + error });
    }
}

async function startTracker(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const playlistId = req.params.id;
    const userId = req?.user?.id;

    try {
        if (!accessToken || !userId) {
            return res.status(401).json({ error: "Spotify access token or user id is not available" });
        }

        let initialSnapshot;

        const sevendaysago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const initialSnapshotExists = await prisma.snapshot.findFirst({
            where: {
                playlistId,
                userId,
                createdAt: {
                    gte: sevendaysago
                }
            }
        })
        if (initialSnapshotExists) {
            initialSnapshot = initialSnapshotExists;
        } else {
            initialSnapshot = await saveSnapshot(playlistId, userId, accessToken);
        }
        const updatedPlaylist = await prisma.playlist.update({
            data: {
                isTracked: true,
                isTrackedBy: userId,
                trackingStartDate: new Date()
            },
            where: { playlistId }
        })

        return res.status(200).json({
            isTracking: true,
            isTrackedBy: userId,
            initialSnapshot: initialSnapshot,
            updatedPlaylist: updatedPlaylist
        });
    } catch (error) {
        console.error("Error tracking playlist:", error);
        return res.status(500).json({ error: "Internal server error while tracking playlist:" + error });
    }
}

async function stopTracker(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const playlistId = req.params.id;
    const userId = req?.user?.id;

    try {
        if (!accessToken || !userId) {
            return res.status(401).json({ error: "Spotify access token or user id is not available" });
        }
        await prisma.playlist.update({
            data: {
                isTracked: false,
                isTrackedBy: null
            },
            where: { playlistId }
        })

        return res.status(200).json({
            isTracking: false,
            isTrackedBy: null,
        });
    } catch (error) {
        console.error("Error stopping playlist tracker:", error);
        return res.status(500).json({ error: "Internal server error while stopping playlist tracker:" + error });
    }
}

async function getPlaylistSnapshots(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;
    try {
        const snapshots = await prisma.snapshot.findMany({
            where: {
                playlistId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        return res.status(200).json({ data: snapshots });
    } catch (error) {
        console.error("Error fetching snapshots:", error);
        return res.status(500).json({ error: "Internal server error while fetching snapshots:" + error });
    }
}
async function getSnapshotById(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;
    const snapshotId = req.params.snapId;
    try {
        const snapshot = await prisma.snapshot.findFirst({
            where: {
                id: snapshotId,
                playlistId
            },
            include: { tracks: true },
        })
        return res.status(200).json({ data: snapshot });
    } catch (error) {
        console.error("Error fetching snapshot:", error);
        return res.status(500).json({ error: "Internal server error while fetching snapshot:" + error });
    }
}

export { getFeaturedPlaylists, getPlaylist, startTracker, stopTracker, getPlaylistSnapshots, getSnapshotById }