import cron from 'node-cron';
import { fetchTracks, saveSnapshot } from './playlists';
import prisma from '../lib/prisma';
import { getSpotifyToken } from './SpotifyAuth';

const cronJob = cron.schedule('0 0 * * *', async () => { // Run daily at midnight
    const { access_token } = await getSpotifyToken();
    const now = new Date();

    const playlists = await prisma.playlist.findMany({
        where: {
            isTracked: true,
            trackingStartDate: { not: null }
        }
    });

    for (let playlist of playlists) {
        const trackingStartDate = new Date(playlist.trackingStartDate!);
        const daysSinceStart = Math.floor((now.getTime() - trackingStartDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceStart > 0 && daysSinceStart % 7 === 0) {
            const tracker = playlist.isTrackedBy || '';
            try {
                const snapshot = await saveSnapshot(playlist.playlistId, tracker, access_token);
            } catch (err) {
                console.error(`Error tracking ${playlist.id}:`, err);
            }
        }
    }
});
export default cronJob;