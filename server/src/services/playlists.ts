import prisma from "../lib/prisma";

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
    const responseData = await fetch(`${process.env.SPOTIFY_URL}/playlists/${id}/tracks?offset=0&limit=100&locale=*`, {
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

async function saveSnapshot(id: string, userId: string, accessToken: string) {
    const tracks = await fetchTracks(id, accessToken);
    const playlist = await fetchPlaylistById(id, accessToken);

    if (tracks && playlist && playlist.valid) {
        console.log('snapshotTed');

        let trackdata: any = [];
        for (let i = 0; i <= tracks.items.length; i++) {
            const item = tracks.items[i];
            const track = item?.track;
            if (!track) continue;
            const artists = track?.artists;

            let artistArr: any = [];

            for (let artist of artists) {
                if (!artists) continue;
                artistArr.push(artist.name)
            }

            const addedTrack = await prisma.track.create({
                data: {
                    id: track.id,
                    name: track.name,
                    album: track.album.name,
                    imageUrl: track.album.images[0]?.url,
                    artists: artistArr,
                    playlistId: id,
                    Playlist: playlist.data.name,
                    rank: i + 1
                }
            });
            trackdata.push(addedTrack);
        }
        console.log('trackdata', trackdata);

        const snapshot = await prisma.snapshot.create({
            data: {
                id: playlist.data.snapshot_id,
                playlist: playlist?.data.name,
                playlistId: id,
                tracks: trackdata,
                userId: userId,
            }
        });
        console.log(snapshot);
        return snapshot;
    }
}

export { fetchPlaylistById, fetchTracks, saveSnapshot };