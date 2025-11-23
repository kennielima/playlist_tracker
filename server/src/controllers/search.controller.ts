import { Request, Response } from "express";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";

async function searchPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    let query = req.query.q as string;

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        const responseData = await fetch(`${process.env.SPOTIFY_URL}/search?q=${encodeURIComponent(query)}&type=playlist&limit=50`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        });
        if (!responseData.ok) {
            const errorBody = await responseData.text();
            return { error: errorBody };
        }
        const fetchedPlaylists = await responseData.json();
        if (fetchedPlaylists.error) {
            return res.status(500).json({ error: "Error searching playlists from Spotify", details: fetchedPlaylists.error });
        }
        let playlists: any[] = [];

        for (let playlist of fetchedPlaylists.playlists.items) {
            if (playlist) {
                playlists.push(playlist);
            }
        }
        return res.status(200).json({ data: playlists });

    } catch (error) {
        console.error("Error searching:", error);
        return res.status(500).json({ error: "Internal server error while searching" });
    }
}

export { searchPlaylists };