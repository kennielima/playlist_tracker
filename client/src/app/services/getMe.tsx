import { cookies } from "next/headers";

const getMe = async () => {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;

    if (!token) {
        throw new Error('No token found in cookies');
    }

    try {
        const response = await fetch(`${process.env.API_URL}/api/users/me`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`,
                // 'Cookies': `token=${token}`
            },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('failed to fetch token')
    }
}

export default getMe;