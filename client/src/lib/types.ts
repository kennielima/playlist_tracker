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
}

type Playlist = {
    id: string
}