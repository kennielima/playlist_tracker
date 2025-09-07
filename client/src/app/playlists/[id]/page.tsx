import fetchAPlaylist from '@/services/getAPlaylist';
import React from 'react'
import PlaylistComponent from './components/PlaylistComponent';
import fetchCurrentUser from '@/services/getMe';
import fetchSpotifyPlaylist from '@/services/getSpotifyPlaylist';
import { getSnapshotById, getSnapshots } from '@/services/getSnapshots';

const page = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const playlistData = await fetchAPlaylist(id);
    const playlistsData = await fetchSpotifyPlaylist();
    const currUser = await fetchCurrentUser();

    if (!playlistData || !playlistData.data) {
        return <div>No playlist found</div>;
    }

    const { data: playlists } = playlistsData;
    const { data: playlist } = playlistData;
    const snapshots = playlist.data.isTracked ? await getSnapshots(id) : null;
    // const snapshotData = playlist.data.isTracked ? await getSnapshotById(id, ) : null;
    return (
        <PlaylistComponent
            playlistData={playlist}
            playlistsData={playlists}
            currUser={currUser}
            snapshots={snapshots}
        />
    )
}

export default page