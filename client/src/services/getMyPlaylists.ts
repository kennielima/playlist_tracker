"use server"
import { cookies } from "next/headers";

const fetchMyPlaylists = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const fetchUserPlaylist = await fetch(`${process.env.API_URL}/api/users/me/playlists`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!fetchUserPlaylist.ok) {
        return null;
    }

    const data = await fetchUserPlaylist.json();
    return data;
}

export default fetchMyPlaylists;