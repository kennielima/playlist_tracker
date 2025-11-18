import searchSpotifyPlaylist from '@/services/searchPlaylist';
import React from 'react'
import SearchResult from './components/SearchResult';

const page = async ({ searchParams }: { searchParams: { q: string } }) => {
    const query = await searchParams;
    const searchData = await searchSpotifyPlaylist(query.q);
    if (!searchData || !searchData.data) {
        return <div>No results found</div>;
    }

    return (
        <SearchResult searchData={searchData} query={query.q} />
    )
}

export default page