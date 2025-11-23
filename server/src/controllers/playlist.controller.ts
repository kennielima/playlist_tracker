import { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { fetchPlaylistById, fetchTracks } from "../services/playlists";
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
                let featuredPlaylist = await prisma.playlist.upsert({
                    where: {
                        playlistId: data.id,
                    },
                    update: {},
                    create: {
                        playlistId: data.id,
                        name: data.name,
                        description: data.description,
                        image: data.images[0].url,
                        url: data.external_urls.spotify,
                        snapshotId: data.snapshot_id,
                    }
                })
                playlists.push(featuredPlaylist);
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

export {
    getFeaturedPlaylists,
    getPlaylist
}