import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    console.log('Inside /api/getUser');

    const cookie = await cookies();
    const token = cookie.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'No token in chart data' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL}/api/charts`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                'Cookies': `token=${token}`
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        // console.log('CHART', data);

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return NextResponse.json({ error: 'Error fetching chart data:' }, { status: 401 });
    }
}