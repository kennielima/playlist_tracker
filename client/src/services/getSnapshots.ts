"use server"
import { cookies } from "next/headers";

const getSnapshots = async (playlistId: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(`${process.env.BASE_URL}/api/getplaylist/${playlistId}/getsnapshots`, {
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

const getSnapshotById = async (playlistId: string, snapshotId: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const res = await fetch(`${process.env.BASE_URL}/api/getplaylist/${playlistId}/getsnapshots/${snapshotId}`, {
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

export { getSnapshots, getSnapshotById };