import cron from 'node-cron';
import { fetchTracks, saveSnapshot } from './playlists';
import prisma from '../lib/prisma';
import { getSpotifyToken } from './SpotifyAuth';

const cronJob = cron.schedule('0 0 * * 0', async () => {
    console.log('running a task every minute');
    const accessToken = await getSpotifyToken();
    const playlists = await prisma.playlist.findMany({
        where: { isTracked: true },
    });
    for (let playlist of playlists) {
        const tracker = playlist.isTrackedBy || '';
        try {
            const snapshot = await saveSnapshot(playlist.playlistId, tracker, accessToken);
            console.log(snapshot);
        } catch (err) {
            console.error(`Error tracking ${playlist.id}:`, err);
        }
    }
});
export default cronJob;