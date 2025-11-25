import { Request, Response } from "express";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import prisma from "../lib/prisma";
import { redis } from "../lib/redis"

async function getPlaylistSnapshots(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;

    const cacheKey = `playlist:${playlistId}/snapshots`;
    const cached = await redis.get(cacheKey);

    try {
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const snapshots = await prisma.snapshot.findMany({
            where: {
                playlistId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        await redis.set(cacheKey, JSON.stringify({ data: snapshots }), "EX", 86400);

        return res.status(200).json({ data: snapshots });
    } catch (error) {
        console.error("Error fetching snapshots:", error);
        return res.status(500).json({ error: "Internal server error while fetching snapshots:" + error });
    }
}

async function getSnapshotById(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;
    const snapshotId = req.params.snapId;

    const cacheKey = `playlist:${playlistId}/snapshot:${snapshotId}`;
    const cached = await redis.get(cacheKey);

    try {
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        const snapshot = await prisma.snapshot.findFirst({
            where: {
                id: snapshotId,
                playlistId
            },
            include: {
                tracks: {
                    include: {
                        track: true
                    },
                    orderBy: {
                        rank: 'asc'
                    }
                }
            },
        })
        await redis.set(cacheKey, JSON.stringify({ data: snapshot }), "EX", 86400);
        return res.status(200).json({ data: snapshot });
    } catch (error) {
        console.error("Error fetching snapshot:", error);
        return res.status(500).json({ error: "Internal server error while fetching snapshot:" + error });
    }
}

export {
    getPlaylistSnapshots,
    getSnapshotById
}