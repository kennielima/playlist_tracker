"use server"
import { cookies } from "next/headers";

const fetchAPlaylist = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const fetchAPlaylist = await fetch(`${process.env.API_URL}/api/playlists/${id}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!fetchAPlaylist.ok) {
        return null;
    }

    const data = await fetchAPlaylist.json();
    return data;
}

export default fetchAPlaylist;