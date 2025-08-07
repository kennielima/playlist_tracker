import React from 'react'
import UserComponent from './components/UserComponent'
import fetchCurrentUser from '@/app/hooks/getMe'
import fetchMyPlaylists from '@/app/hooks/getMyPlaylists'

type Params = Promise<{
    id: string
}>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const user = id === 'me' && await fetchCurrentUser();
    const playlistData = await fetchMyPlaylists();
    console.log('playlistData', playlistData);

    return (
        <UserComponent user={user} playlistData={playlistData} />
    )
}

export default page