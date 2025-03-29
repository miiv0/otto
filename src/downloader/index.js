import { YouTubeTrackDownloader } from "./youtube.js";

const TRACK_DOWNLOADER = new YouTubeTrackDownloader();

export const downloadTrack = async (track) => {
  try {
    return await TRACK_DOWNLOADER.download(track);
  } catch (error) {
    return null;
  }
};
