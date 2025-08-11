"use server"
import { cookies } from "next/headers";

const fetchSpotifyPlaylist = async () => {
    const cookieHeader = await cookies().toString();

    const fetchSpotifyPlaylist = await fetch(`${process.env.BASE_URL}/api/getspotifyplaylists`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });

    if (!fetchSpotifyPlaylist.ok) {
        return null;
    }

    const { data } = await fetchSpotifyPlaylist.json();
    // console.log('fetch', data, fetchSpotifyPlaylist)
    return data;
}

export default fetchSpotifyPlaylist;