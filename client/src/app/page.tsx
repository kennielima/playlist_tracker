import { QueryClient, useQuery } from '@tanstack/react-query'
import fetchMyPlaylists from "./hooks/getMyPlaylists";

export default async function Home() {
  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <div>getchart</div>
    </div>
  );
}
