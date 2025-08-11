import express, { Request, Response } from "express";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";

async function searchFn(q: string, accessToken: string) {
    const responseData = await fetch(`${process.env.SPOTIFY_URL}/search?q=${encodeURIComponent(q)}&type=playlist&market=US&limit=50`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    if (!responseData.ok) {
        const errorBody = await responseData.text();
        console.log("Error searching Spotify playlists:", errorBody);
    }
    const fetchedPlaylists = await responseData.json();
    return fetchedPlaylists;
}

async function searchPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    let query = req.query.q as string;

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        const fetchedPlaylists = await searchFn(query, accessToken);
        let playlists: any[] = [];

        for (let playlist of fetchedPlaylists.playlists.items) {
            if (playlist) {
                playlists.push(playlist);
                console.log('SEARCHownerid', playlist.owner.id, playlist.name);
            }
        }
        console.log("Playlists length:", playlists.length);
        return res.status(200).json({ data: playlists });

    } catch (error) {
        console.error("Error searching:", error);
        return res.status(500).json({ error: "Internal server error while searching" });
    }
}

export { searchFn, searchPlaylists };