import { Request, Response, NextFunction } from "express";
import { getRefreshToken, getSpotifyToken } from "../lib/SpotifyAuth";
import prisma from "../lib/prisma";

export interface TokenRequest extends Request {
    access_token?: string;
    refresh_token?: string;
    token_expiresIn?: number;
}

const ensureSpotifyToken = async (req: TokenRequest, res: Response, next: NextFunction) => {
    let now = Date.now();

    try {
        const user = req.user;
        // console.log("user is", user);
        let tokenExpiryDate;
        let accessToken;
        let refreshToken;

        if (user) {
            const { spotifyaccessToken, tokenExpiry, spotifyrefreshToken } = user;
            if (!spotifyaccessToken || !tokenExpiry || now >= tokenExpiry) {
                const { access_token, refresh_token, expires_in } = await getRefreshToken(spotifyrefreshToken!);
                accessToken = access_token;
                refreshToken = refresh_token || spotifyrefreshToken;
                tokenExpiryDate = now + expires_in * 1000;

                const updateUser = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        spotifyaccessToken: access_token,
                        tokenExpiry: expires_in,
                        spotifyrefreshToken: refresh_token
                    }
                })
            } else {
                accessToken = spotifyaccessToken;
                refreshToken = spotifyrefreshToken;
                tokenExpiryDate = now + tokenExpiry! * 1000;
            }
            // console.log("usertokens", accessToken, refreshToken, tokenExpiryDate)

        } else {
            const token = await getSpotifyToken();
            accessToken = token.access_token;
            tokenExpiryDate = now + token.expires_in * 1000;
            // console.log("spotify token", token)
        }

        req.access_token = accessToken;
        req.refresh_token = refreshToken || null;
        req.token_expiresIn = tokenExpiryDate;
        // console.log("req tokens", tokenExpiryDate, accessToken, refreshToken);

        next();

    } catch (error) {
        console.error("Error fetching Spotify token:", error);
        return res.status(500).json({ error: "Internal server error while fetching Spotify token" });
    }
};


export default ensureSpotifyToken;