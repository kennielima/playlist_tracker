import fetchAPlaylist from '@/services/getAPlaylist';
import React from 'react'
import PlaylistComponent from './components/PlaylistComponent';
import fetchCurrentUser from '@/services/getMe';
import fetchSpotifyPlaylist from '@/services/getSpotifyPlaylist';

const page = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const playlistData = await fetchAPlaylist(id);
    const playlistsData = await fetchSpotifyPlaylist();
    const currUser = await fetchCurrentUser();

    if (!playlistData || !playlistData.data) {
        return <div>No playlist found</div>;
    }
    const playlist = playlistData?.data
    const playlists = playlistsData?.data
    return (
        <PlaylistComponent playlistData={playlist} playlistsData={playlists} currUser={currUser} />
    )
}

export default page