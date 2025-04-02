import { YouTubeTrackResolver } from "./youtube.js";

const TRACK_RESOLVERS = [new YouTubeTrackResolver()];

export const resolveQuery = async (query) => {
  const resolvers = TRACK_RESOLVERS.map((resolver) => resolver.resolve(query));

  return await Promise.any(resolvers);
};
