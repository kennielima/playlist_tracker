"use server"
import { cookies } from "next/headers";

const trackPlaylist = async (id: string, userId: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(`${process.env.BASE_URL}/api/trackplaylist/${id}/${userId}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });
    console.log(res)
    if (!res.ok) {
        return null;
    }

    const { data } = await res.json();
    return data;
}

export default trackPlaylist;