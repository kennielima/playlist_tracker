import Homepage from "@/components/Home";
import fetchCurrentUser from "@/services/getMe";
import fetchSpotifyPlaylist from "@/services/getSpotifyPlaylist";

export default async function Home() {
  const playlistData = await fetchSpotifyPlaylist();
  const user = await fetchCurrentUser();

  return (
    <Homepage playlistData={playlistData} user={user} />
  );
}
