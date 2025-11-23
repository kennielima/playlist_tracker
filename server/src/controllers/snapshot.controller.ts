import { Request, Response } from "express";
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import prisma from "../lib/prisma";

async function getPlaylistSnapshots(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;
    try {
        const snapshots = await prisma.snapshot.findMany({
            where: {
                playlistId
            },
            orderBy: [{
                createdAt: 'desc'
            }]
        })
        return res.status(200).json({ data: snapshots });
    } catch (error) {
        console.error("Error fetching snapshots:", error);
        return res.status(500).json({ error: "Internal server error while fetching snapshots:" + error });
    }
}

async function getSnapshotById(req: TokenRequest, res: Response) {
    const playlistId = req.params.id;
    const snapshotId = req.params.snapId;
    try {
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