import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { id: string, userId: string } }) => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;
    const { id, userId } = await params;
    console.log('checking route', id, userId)
    try {
        const response = await fetch(`${process.env.API_URL}/api/playlists/${id}/users/${userId}/trackplaylist`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlist on route');
        }
        const data = await response.json();

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return NextResponse.json({ error: 'Error fetching playlist:' }, { status: 401 });
    }
}