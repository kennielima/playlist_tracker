import fetchAPlaylist from '@/services/getAPlaylist';
import React from 'react'
import PlaylistComponent from './components/PlaylistComponent';

const page = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;

    const playlistData = await fetchAPlaylist(id);

    if (!playlistData || !playlistData.data) {
        return <div>No playlist found</div>;
    }
    return (
        <PlaylistComponent />
    )
}

export default page