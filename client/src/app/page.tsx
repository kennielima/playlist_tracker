import fetchSpotifyPlaylist from "@/services/getSpotifyPlaylist";

export default async function Home() {
  const playlistData = await fetchSpotifyPlaylist();
  console.log('playlistData', playlistData);

  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <div>getchart</div>
    </div>
  );
}
