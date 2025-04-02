import { YouTubeTrackDownloader } from "./youtube.js";

const TRACK_DOWNLOADER = new YouTubeTrackDownloader();

export const downloadTrack = async (track) =>
  await TRACK_DOWNLOADER.download(track);
