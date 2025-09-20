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

async function saveSnapshot(id: string, userId: string, accessToken: string) {
    const tracks = await fetchTracks(id, accessToken);
    const playlist = await fetchPlaylistById(id, accessToken);

    if (tracks && playlist && playlist.valid) {
        let trackdata = [];
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

            const existingTrack = await prisma.track.findFirst({
                where: {
                    id: track.id,
                }
            });
            if (!existingTrack) {
                const addedTrack = await prisma.track.create({
                    data: {
                        id: track.id,
                        name: track.name,
                        album: track.album.name,
                        imageUrl: track.album.images[0]?.url,
                        artists: artistArr,
                        Playlist: {
                            connect: { playlistId: id }
                        },
                        rank: i + 1
                    }
                });
                trackdata.push(addedTrack);
            }
            else {
                trackdata.push(existingTrack)
            }
        }

        const snapshot = await prisma.snapshot.create({
            data: {
                // id: playlist.data.snapshot_id,
                playlist: {
                    connect: { playlistId: id }
                },
                tracks: {
                    connect: trackdata.map(track => ({ id: track.id }))
                },
                user: {
                    connect: { id: userId }
                },
            }
        });
        return snapshot;
    }
}

export { fetchPlaylistById, fetchTracks, saveSnapshot };