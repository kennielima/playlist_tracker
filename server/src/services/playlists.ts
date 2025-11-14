async function fetchPlaylistById(id: string, accessToken: string) {
    const responseData = await fetch(`${process.env.SPOTIFY_URL}/playlists/${id}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });

    if (!responseData.ok) {
        const errorBody = await responseData.text();
        return { valid: false, error: errorBody };
    }

    const fetchedPlaylist = await responseData.json();

    return { valid: true, data: fetchedPlaylist };
}

async function fetchTracks(id: string, accessToken: string) {
    const responseData = await fetch(`${process.env.SPOTIFY_URL}/playlists/${id}/tracks?offset=0&locale=*`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    if (!responseData.ok) {
        const errorBody = await responseData.text();
        return errorBody;
    }

    const data = await responseData.json();
    return data;
}

export { fetchPlaylistById, fetchTracks };