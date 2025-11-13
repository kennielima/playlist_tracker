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
    isTrackedBy: string | null
}

export type Track = {
    artists: string[];
    imageUrl: string;
    playlist: string;
    playlistId: string;
    name: string
    trackId: string;
    snapshotId?: string;
    album: string;
    rank?: number
    tracks?: SnapshotTrack[]
}
export type SnapshotTrack = {
    id: string;
    snapshotId: string;
    rank: number
    createdAt: string;
    track: Track;
}

export type Snapshot = {
    id: string
    playlist: string;
    playlistId: string;
    createdAt: string
    updatedAt: string
    userId: string
    tracks: SnapshotTrack[]
}