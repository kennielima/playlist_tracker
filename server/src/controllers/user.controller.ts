import { Request, Response } from "express"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import prisma from "../lib/prisma";

async function getMe(req: Request, res: Response) {
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function fetchCurrentUserPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const tokenExpiry = req.token_expiresIn;
    const user = req.user;

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        const response = await fetch(`${process.env.SPOTIFY_URL}/me/playlists`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        })
        const playlistData = await response.json();

        let fetchedPlaylists = [];
        for (let playlist of playlistData.items) {
            const newPlaylist = await prisma.playlist.upsert({
                where: {
                    playlistId: playlist.id
                },
                update: {},
                create: {
                    name: playlist.name,
                    description: playlist.description,
                    // tracks: playlist.tracks,
                    image: playlist.images[0].url,
                    url: playlist.external_urls.spotify,
                    userId: user ? user.id : null,
                    snapshotId: playlist.snapshot_id,
                    playlistId: playlist.id,
                }
            })
            fetchedPlaylists.push(newPlaylist)
        }
        return res.status(200).json({ data: fetchedPlaylists });

    } catch (error) {
        console.error("Error fetching user playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching user playlist" });
    }
}
async function fetchUserSnapshots(req: TokenRequest, res: Response) {
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const snapshots = await prisma.snapshot.findMany({
            where: {
                userId: user.id
            },
            include: {
                playlist: true
            }
        });
        return res.status(200).json({ snapshots });
    } catch (error) {
        console.error("Error fetching user snapshot:", error);
        return res.status(500).json({ error: "Internal server error while fetching user snapshots" });
    }
}

export { getMe, fetchCurrentUserPlaylists, fetchUserSnapshots }