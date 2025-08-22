import express, { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { fetchPlaylistById } from "../lib/playlists";
import { featuredPlaylists } from "../lib/seededPlaylists";

async function getFeaturedPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        let playlists = [];
        for (let seed of featuredPlaylists) {
            const validated = await fetchPlaylistById(seed.id, accessToken);
            if (validated && validated.valid) {
                const data = validated.data;
                const exists = await prisma.playlist.findUnique({
                    where: {
                        playlistId: data.id,
                    }
                })
                let featuredPlaylist;
                if (!exists) {
                    featuredPlaylist = await prisma.playlist.create({
                        data: {
                            playlistId: data.id,
                            name: data.name,
                            description: data.description,
                            image: data.images[0].url,
                            url: data.external_urls.spotify,
                            snapshotId: data.snapshot_id,
                        }
                    })
                    playlists.push(featuredPlaylist);
                }
                playlists.push(exists);
            } else {
                console.error("Error fetching playlist:", validated);
            }
        }

        return res.status(200).json({ data: playlists });

    } catch (error) {
        console.error("Error fetching featured playlists:", error);
        return res.status(500).json({ error: "Internal server error while fetching featured playlists" });
    }
}

async function getPlaylist(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const id = req.params.id;

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        let playlist;
        const fetchFromDb = await prisma.playlist.findUnique({
            where: {
                playlistId: id,
            }
        })
        if (!fetchFromDb) {
            const fetchFromSpotify = await fetchPlaylistById(id, accessToken);
            // console.log('Fetched from Spotify:', fetchFromSpotify);

            if (fetchFromSpotify && fetchFromSpotify.valid) {
                playlist = fetchFromSpotify.data;

            } else {
                return res.status(500).json({ error: "Error fetching playlist from Spotify" });
            }
        } else {
            playlist = fetchFromDb;
        };



        const fetchTracks = await fetch(`${process.env.SPOTIFY_URL}/playlists/${id}/tracks?offset=0&limit=100&locale=*`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        });
        if (!fetchTracks.ok) {
            const errorBody = await fetchTracks.text();
            return { error: errorBody };
        }

        const tracks = await fetchTracks.json();

        let trackdata: any = [];
        for (let i = 0; i <= tracks.items.length; i++) {
            const item = tracks.items[i];
            const track = item?.track;
            if (!track) continue;
            const artists = track?.artists;

            let artistArr: any = [];

            for (let artist of artists) {
                if (!track.artists) continue;
                artistArr.push(artist.name)
            }

            trackdata.push({
                imageUrl: track.album.images[0].url,
                trackId: track.id,
                title: track.name,
                artist: artists,
                playlistId: id,
                playlist: playlist.name,
                rank: i + 1
            })
        }
        return res.status(200).json({ data: playlist, tracks: trackdata });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching playlist:" + error });
    }
}

export { getFeaturedPlaylists, getPlaylist }