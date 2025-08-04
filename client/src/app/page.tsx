// import useGetPlaylist from "./services/useGetPlaylist";

import { cookies } from "next/headers";

export default async function Home() {
  const cookieHeader = cookies().toString();

  const res = await fetch(`${process.env.BASE_URL}/api/getplaylist`, {
    method: "GET",
    headers: {
      cookie: cookieHeader
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }

  const { data } = await res.json();

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>getchart</div>
    </div>
  );
}
