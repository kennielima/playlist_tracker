export type User = {
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
    playlists: Playlist[]
    spotifyId: string
    spotifyaccessToken?: string
    spotifyrefreshToken?: string
    tokenExpiry: number
    userImage: string
}

export type Playlist = {
    id: string,
    name: string
    createdAt: string
    updatedAt: string
    description: string
    userId: string
    image: string
    images?: { url: string }[]
    url: string
    playlistId: string
    snapshotId: string
    isTracked: boolean
}

export type Track = {
    artist: string[];
    imageUrl: string;
    playlist: string;
    playlistId: string;
    rank: number
    title: string
    trackId: string;
}

export type Snapshot = {
    playlist: string;
    playlistId: string;
    createdAt: string
    updatedAt: string
    userId: string
    track: Track[]
}