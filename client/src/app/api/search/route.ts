import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    try {
        const response = await fetch(`${process.env.API_URL}/api/search?q=${query}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Error getting search response:', data);
            return NextResponse.json({ error: 'Error getting search response:' }, { status: 500 });
        }
        const data = await response.json();

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error sending search query:', error);
        return NextResponse.json({ error: 'Error sending search query:' }, { status: 401 });
    }
}