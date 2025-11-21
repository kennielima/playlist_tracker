"use server"
import { cookies } from "next/headers";

const startTracker = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/tracker/${id}/startTracker`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}
const stopTracker = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/tracker/${id}/stopTracker`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}

export { startTracker, stopTracker };