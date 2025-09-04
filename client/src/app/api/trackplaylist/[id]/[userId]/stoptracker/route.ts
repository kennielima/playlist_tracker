import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { id: string, userId: string } }) => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;
    const { id, userId } = await params;
    try {
        const response = await fetch(`${process.env.API_URL}/api/playlists/${id}/users/${userId}/stopTracker`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to stop tracker on route');
        }
        const data = await response.json();

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error stopping playlist tracker:', error);
        return NextResponse.json({ error: 'Error stopping playlist tracker:' }, { status: 401 });
    }
}