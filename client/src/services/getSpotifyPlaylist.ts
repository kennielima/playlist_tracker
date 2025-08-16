"use server"
import { cookies } from "next/headers";

const fetchSpotifyPlaylist = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

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
    return data;
}

export default fetchSpotifyPlaylist;