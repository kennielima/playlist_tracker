import searchSpotifyPlaylist from '@/services/searchPlaylist';
import React from 'react'
import SearchComponent from './components/SearchComponent';

const page = async ({ searchParams }: { searchParams: { q: string } }) => {
    const query = await searchParams;
    const searchData = await searchSpotifyPlaylist(query.q);
    if (!searchData || !searchData.data) {
        return <div>No results found</div>;
    }

    return (
        <SearchComponent searchData={searchData} />
    )
}

export default page