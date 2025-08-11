import Homepage from "@/components/Home";
import fetchSpotifyPlaylist from "@/services/getSpotifyPlaylist";

export default async function Home() {
  const { data: playlistData } = await fetchSpotifyPlaylist();
  console.log('feat', playlistData);

  return (
    <Homepage playlistData={playlistData} />
  );
}
