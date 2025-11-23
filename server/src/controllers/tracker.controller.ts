import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { saveSnapshot } from "../services/snapshot";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";

async function startTracker(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const playlistId = req.params.id;
    const userId = req?.user?.id;

    try {
        if (!accessToken || !userId) {
            return res.status(401).json({ error: "Spotify access token or user id is not available" });
        }

        const sevendaysago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const initialSnapshotExists = await prisma.snapshot.findFirst({
            where: {
                playlistId,
                userId,
                createdAt: {
                    gte: sevendaysago
                }
            }
        })

        const snapshot = await saveSnapshot(playlistId, userId, accessToken, initialSnapshotExists || null)

        const updatedPlaylist = await prisma.playlist.update({
            data: {
                isTracked: true,
                isTrackedBy: userId,
                trackingStartDate: new Date()
            },
            where: { playlistId }
        })

        return res.status(200).json({
            isTracking: true,
            isTrackedBy: userId,
            snapshot: snapshot,
            updatedPlaylist: updatedPlaylist
        });
    } catch (error) {
        console.error("Error tracking playlist:", error);
        return res.status(500).json({ error: "Internal server error while tracking playlist:" + error });
    }
}

async function stopTracker(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const playlistId = req.params.id;
    const userId = req?.user?.id;

    try {
        if (!accessToken || !userId) {
            return res.status(401).json({ error: "Spotify access token or user id is not available" });
        }
        const playlist = await prisma.playlist.update({
            data: {
                isTracked: false,
                // isTrackedBy: null
            },
            where: { playlistId }
        })

        return res.status(200).json({
            isTracking: false,
            // isTrackedBy: null,
        });
    } catch (error) {
        console.error("Error stopping playlist tracker:", error);
        return res.status(500).json({ error: "Internal server error while stopping playlist tracker:" + error });
    }
}

export {
    startTracker,
    stopTracker
}