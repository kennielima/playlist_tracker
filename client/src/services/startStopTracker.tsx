"use server"
import { cookies } from "next/headers";

const startTracker = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(`${process.env.BASE_URL}/api/getplaylist/${id}/starttracker`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });
    if (!res.ok) {
        return null;
    }

    const { data } = await res.json();
    return data;
}
const stopTracker = async (id: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(`${process.env.BASE_URL}/api/getplaylist/${id}/stoptracker`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });
    if (!res.ok) {
        return null;
    }

    const { data } = await res.json();
    return data;
}

export { startTracker, stopTracker };