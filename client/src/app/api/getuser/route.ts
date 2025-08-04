import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'No token found in cookies' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        // console.log('USER', data)

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Error fetching user data:' }, { status: 401 });
    }
}