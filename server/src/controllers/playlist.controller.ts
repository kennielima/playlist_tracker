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
        for (let i = 0; i <= tracks.items.length; i++) {
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
                title: track.name,
                artist: artistArr,
                playlistId: id,
                playlist: playlist.name,
                rank: i + 1
            })
        }
        return res.status(200).json({ data: playlist, tracks: trackdata });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching playlist:" + error });
    }
}

async function trackPlaylist(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const playlistId = req.params.id;
    const userId = req.params.userId;

    try {
        if (!accessToken || !userId) {
            return res.status(401).json({ error: "Spotify access token or user id is not available" });
        }
        const trackPlaylist = await prisma.playlist.update({
            data: {
                isTracked: true,
                isTrackedBy: userId
            },
            where: { playlistId }
        })
        if (!trackPlaylist) {
            return res.status(401).json({ error: "Error while attempting to start tracking playlist", isTracking: false });
        }
        const initialSnapshot = await saveSnapshot(playlistId, userId, accessToken);

        return {
            isTracking: true,
            isTrackedBy: userId,
            initialSnapshot: initialSnapshot
        };
    } catch (error) {
        console.error("Error tracking playlist:", error);
        return res.status(500).json({ error: "Internal server error while tracking playlist:" + error });
    }
}

export { getFeaturedPlaylists, getPlaylist, trackPlaylist }