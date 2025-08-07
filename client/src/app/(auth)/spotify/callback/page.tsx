import React, { useEffect } from 'react'
import CallbackPage from './components/CallbackPage';
import { cookies } from 'next/headers';
import fetchCurrentUser from '@/app/hooks/getMe';

const page = async () => {
    const user = await fetchCurrentUser();

    return (
        <CallbackPage user={user} />
    )
}

export default page