import { fetch } from "undici"

const token = process.env.SPOTIFY_TOKEN

async function searchSpotify(query, token) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }

    })
    console.log(response)
};

searchSpotify("hello", token)