"use server"
import { cookies } from "next/headers";


const fetchMySnapshots = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const fetchMySnapshots = await fetch(`${process.env.BASE_URL}/api/getmysnapshots`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });

    if (!fetchMySnapshots.ok) {
        return null;
    }

    const { data } = await fetchMySnapshots.json();
    return data;
}

export default fetchMySnapshots;