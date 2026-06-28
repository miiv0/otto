import { fetch } from 'undici'
import spotifyUrlInfo from 'spotify-url-info'

const { getData, getPreview, getTracks, getDetails } = spotifyUrlInfo(fetch)

getPreview('https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas').then(data =>
    console.log(data)
)