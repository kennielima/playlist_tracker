"use server"
import { cookies } from "next/headers";


const fetchMySnapshots = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const fetchMySnapshots = await fetch(`${process.env.API_URL}/api/users/me/snapshots`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!fetchMySnapshots.ok) {
        return null;
    }

    const data = await fetchMySnapshots.json();
    return data;
}

export default fetchMySnapshots;