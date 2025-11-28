import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, TOKEN_API } from "../lib/config";

let client_id = SPOTIFY_CLIENT_ID || 'CLIENT_ID';
let client_secret = SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET';

async function getSpotifyToken() {
    const response = await fetch(`${TOKEN_API}`, {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret': client_secret
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    });

    const token = await response.json();
    return token;
}

async function getRefreshToken(refreshToken: string) {

    const response = await fetch(`${TOKEN_API}`, {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'client_id': client_id,
            // 'client_secret': client_secret,
            refresh_token: refreshToken,

        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    });

    const token = await response.json();
    return token;
}

export { getSpotifyToken, getRefreshToken };