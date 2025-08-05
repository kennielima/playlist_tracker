import { Request, Response } from "express"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";

async function getMe(req: Request, res: Response) {
    const user = req.user;
    // console.log("req.user", user)
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

async function fetchUserPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const tokenExpiry = req.token_expiresIn;
    const user = req.user;
    // console.log(accessToken, user, tokenExpiry)

    try {
        if (!accessToken) {
            throw new Error("Spotify access token is not available");
        }
        const response = await fetch(`${process.env.SPOTIFY_URL}/me/playlists`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        })
        const data = await response.json();
        // console.log(data);

        return res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching track info:", error);
        return res.status(500).json({ error: "Internal server error while fetching user playlist" });
    }
}

export { getMe, fetchUserPlaylists }