import { YouTubeTrackResolver } from "./youtube.js";
import { SpotifyTrackResolver } from "./spotify.js";

const TRACK_RESOLVERS = [new SpotifyTrackResolver(), new YouTubeTrackResolver()];

export const resolveQuery = async (query) => {
  const resolvers = TRACK_RESOLVERS.map((resolver) => resolver.resolve(query));

  return await Promise.any(resolvers);
};
