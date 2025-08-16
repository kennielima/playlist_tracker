"use server"
import { cookies } from "next/headers";

const fetchCurrentUser = async () => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(`${process.env.BASE_URL}/api/getcurrentuser`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
        }
    });

    if (!res.ok) {
        return null;
    }
    const { data } = await res.json();

    return data.user;
}

export default fetchCurrentUser;