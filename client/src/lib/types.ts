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
    chartCountryId: string
    image: string
    url: string
    playlistId: string
    snapshotId: string
}