"use server"
import { cookies } from "next/headers";

const searchSpotifyPlaylist = async (q: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const searchSpotifyPlaylist = await fetch(`${process.env.BASE_URL}/api/search?q=${q}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });

    if (!searchSpotifyPlaylist.ok) {
        return null;
    }

    const { data } = await searchSpotifyPlaylist.json();
    return data;
}

export default searchSpotifyPlaylist;