
let client_id = process.env.SPOTIFY_CLIENT_ID || 'CLIENT_ID';
let client_secret = process.env.SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET';

async function getSpotifyToken() {
    const response = await fetch(`${process.env.TOKEN_API}`, {
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
    // console.log("tokenauth", token)
    return token;
}

async function getRefreshToken(refreshToken: string) {

    const response = await fetch(`${process.env.TOKEN_API}`, {
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
    // console.log('rtoken', token)
    return token;
}

export { getSpotifyToken, getRefreshToken };