import { Request, Response, NextFunction } from "express";
import { getRefreshToken, getSpotifyToken } from "../lib/SpotifyAuth";

export interface TokenRequest extends Request {
    access_token?: string;
    token_expiresIn?: number;
}

const ensureSpotifyToken = async (req: TokenRequest, res: Response, next: NextFunction) => {
    let now = Date.now();

    try {
        const { access_token, expires_in } = await getSpotifyToken();

        let tokenExpiry = now + expires_in * 1000;

        if (!access_token || now >= tokenExpiry) {
            const { access_token, expires_in } = await getRefreshToken();
            let tokenExpiry = now + expires_in * 1000;

            req.access_token = access_token;
            req.token_expiresIn = tokenExpiry;
        } else {

            req.access_token = access_token;
            req.token_expiresIn = tokenExpiry;
        }
        next();
    } catch (error) {
        console.error("Error fetching Spotify token:", error);
        return res.status(500).json({ error: "Internal server error while fetching Spotify token" });
    }
};


export default ensureSpotifyToken;