import express, { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";


async function getTrackInfo(req: TokenRequest, response: Response) {

    const accessToken = req.access_token;
    // const tokenExpiresIn = req.token_expiresIn;
    try {
        if (!accessToken) {
            throw new Error("Spotify access token is not available");
        }

        // const responseData = await fetch(`${process.env.SPOTIFY_URL}/v1/browse/featured-playlists?limit=1&country=US`, {
        // const responseData = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {
        const responseData = await fetch(`${process.env.SPOTIFY_URL}/search?q=top+50+global&type=playlist`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        });

        if (!responseData.ok) {
            console.error('Spotify API Error:', responseData.status, responseData.statusText);
            const errorBody = await responseData.text();
            console.error('Error body:', errorBody);
            throw new Error(`Spotify API request failed: ${responseData.status}`);
        }
        const data = await responseData.json();
        // console.log("Track Info:", data);
        return response.status(200).json(data);
    } catch (error) {
        console.error("Error fetching track info:", error);
        return response.status(500).json({ error: "Internal server error while fetching track info" });
    }
}

export { getTrackInfo }