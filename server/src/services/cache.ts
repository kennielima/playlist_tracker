import { redis } from "../lib/redis";

export async function invalidatePlaylistCache(playlistId: string) {
    const key = `playlist:${playlistId}`;
    await redis.del(key);
}

export async function updatePlaylistCache(
    playlistId: string,
    updates: Partial<{
        isTracked: boolean;
        isTrackedBy: string;
        trackingStartDate: Date;
        isFeatured: boolean;
    }>
) {
    const key = `playlist:${playlistId}`;
    const cached = await redis.get(key);
    if (!cached) return;

    const obj = JSON.parse(cached);
    obj.data = { ...obj.data, ...updates };
    await redis.set(key, JSON.stringify(obj), "EX", 86400);
}
