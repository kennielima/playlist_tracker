import { cookies } from "next/headers";

const fetchMyPlaylists = async () => {
    const cookieHeader = await cookies().toString();
    //   const queryClient = new QueryClient();

    const fetchUserPlaylist = await fetch(`${process.env.BASE_URL}/api/getmyplaylists`, {
        method: "GET",
        headers: {
            cookie: cookieHeader
        }
    });

    if (!fetchUserPlaylist.ok) {
        return null;
    }

    const { data } = await fetchUserPlaylist.json();
    // console.log('fetch', data, fetchUserPlaylist)
    return data;
}

export default fetchMyPlaylists;