import getMe from '@/app/services/getMe';
import React, { useEffect } from 'react'
import CallbackPage from './components/CallbackPage';

const page = async () => {
    const user = await getMe();
    return (
        <CallbackPage userData={user} />
    )
}

export default page