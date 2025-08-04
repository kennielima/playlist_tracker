import React, { useEffect } from 'react'
import CallbackPage from './components/CallbackPage';
import { cookies } from 'next/headers';

const page = async () => {
    const cookieHeader = cookies().toString();
    const res = await fetch(`${process.env.BASE_URL}/api/getuser`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch user data');
    }

    const { data } = await res.json();
    const user = data.user;
    console.log('user', user);

    return (
        <CallbackPage user={user} />
    )
}

export default page