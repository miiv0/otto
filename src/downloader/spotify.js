import spotify from "spotify-url-info"
import { fetch } from "undici"

const spotify = spotify(fetch)

const data = await spotify.getData("https://open.spotify.com/track/5OXVLqrKCofCk4TLRHFGu8?si=c9de5226024e4848");
