import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;

    try {
        const response = await fetch(`${process.env.API_URL}/api/playlists/get-featured`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });
        if (!response.ok) {
            const data = await response.json();
            console.error('Error fetching featured playlists:', data);
            return NextResponse.json({ error: 'Error fetching featured playlists:' }, { status: 500 });
        }
        const data = await response.json();

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error fetching featured playlists:', error);
        return NextResponse.json({ error: 'Error fetching featured playlists:' }, { status: 401 });
    }
}