"use server"
import { cookies } from "next/headers";

const fetchAPlaylist = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const fetchAPlaylist = await fetch(`${process.env.BASE_URL}/api/getplaylist/${id}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });

    if (!fetchAPlaylist.ok) {
        return null;
    }

    const { data } = await fetchAPlaylist.json();
    return data;
}

export default fetchAPlaylist;