import { Readable } from "node:stream";
import { createAudioResource, demuxProbe } from "@discordjs/voice";
import { Innertube, UniversalCache } from "youtubei.js";

export class YouTubeTrackDownloader {
  #youtube;

  async #createSession() {
    if (this.#youtube) return this.#youtube;

    const youtube = await Innertube.create({
      cache: new UniversalCache(),
    });

    this.#youtube = youtube;

    return youtube;
  }

  async download(track) {
    const id = track.youtube?.id ?? null;

    if (!id) {
      throw new Error("Unable to download track audio.");
    }

    const youtube = await this.#createSession();

    const stream = await youtube.download(id, {
      type: "audio",
      quality: "bestefficiency",
    });
    const readable = Readable.fromWeb(stream);

    const probe = await demuxProbe(readable);

    return createAudioResource(probe.stream, {
      inputType: probe.type,
      metadata: track,
    });
  }
}
