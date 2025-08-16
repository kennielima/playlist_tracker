import express, { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { fetchPlaylistById } from "../lib/playlists";
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

export { getFeaturedPlaylists }
