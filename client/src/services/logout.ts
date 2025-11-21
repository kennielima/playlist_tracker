"use server"
// import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const logout = async () => {
    // const cookie = await cookies();
    const res = await fetch(`${process.env.API_URL}/api/auth/spotify/logout`, {
        method: "GET",
        credentials: 'include',
    });
    // cookie.delete('token');
    if (!res.ok) {
        return null;
    }

    redirect('/login');
    // window.location.href = '/login';
}

export default logout;