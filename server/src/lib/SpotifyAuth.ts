
let client_id = process.env.SPOTIFY_CLIENT_ID || 'CLIENT_ID';
let client_secret = process.env.SPOTIFY_CLIENT_SECRET || 'CLIENT_SECRET';

async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
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
    console.log(token);
    return token;
}

export default getSpotifyToken;