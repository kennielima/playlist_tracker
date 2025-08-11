

async function fetchPlaylistById(id: string, accessToken: string) {
    const responseData = await fetch(`${process.env.SPOTIFY_URL}/playlists/${id}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });

    if (!responseData.ok) {
        const errorBody = await responseData.text();
        console.log("Error fetching Spotify playlists:", errorBody);
        return { valid: false, error: errorBody };
    }

    const fetchedPlaylist = await responseData.json();
    console.log("validated:", fetchedPlaylist);

    return { valid: true, data: fetchedPlaylist };
}

export { fetchPlaylistById };