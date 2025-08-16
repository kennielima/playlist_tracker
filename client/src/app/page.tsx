import Homepage from "@/components/Home";
import fetchCurrentUser from "@/services/getMe";
import fetchSpotifyPlaylist from "@/services/getSpotifyPlaylist";

export default async function Home() {
  const data = await fetchSpotifyPlaylist();
  const playlistData = data?.data || [];
  const user = await fetchCurrentUser();

  return (
    <Homepage playlistData={playlistData} user={user} />
  );
}
