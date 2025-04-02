import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  entersState,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Collection } from "discord.js";
import { downloadTrack } from "./downloader/index.js";
import { createTrackEmbed } from "./embeds.js";

const queues = new Collection();

export default class Queue {
  tracks;
  #audioPlayer;

  constructor() {
    this.tracks = [];
    this.#audioPlayer = createAudioPlayer();

    this.#audioPlayer.on("stateChange", async (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Playing) {
        const track = newState.resource.metadata;

        await track.interaction?.followUp({
          embeds: [createTrackEmbed(track, { title: "Now Playing" })],
        });
      } else if (newState.status === AudioPlayerStatus.Idle) {
        await this.#process();
      }
    });
  }

  static join(voiceChannel) {
    const guildId = voiceChannel.guild.id;

    let queue = queues.get(guildId);

    if (!queue) {
      queue = new Queue();

      queues.set(guildId, queue);
    }

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      group: "queue",
    });

    // Since `joinVoiceChannel` can return a new or existing voice connection,
    // we'll remove all event listeners to ensure we don't assign duplicate
    // event listeners later.
    //
    // It's heavily assumed that `VoiceConnection` doesn't rely on its own event
    // listeners internally, which seems to be the case.
    //
    // Also, I probably shouldn't be doing this...
    voiceConnection.removeAllListeners();

    voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        // If it appears that the voice connection is attempting to
        // reconnect, we'll ignore the disconnect.
        await Promise.race([
          await entersState(
            voiceConnection,
            VoiceConnectionStatus.Signalling,
            5_000,
          ),
          await entersState(
            voiceConnection,
            VoiceConnectionStatus.Connecting,
            5_000,
          ),
        ]);
      } catch {
        voiceConnection.destroy();
      }
    });

    voiceConnection.on(VoiceConnectionStatus.Destroyed, () => {
      queue.#destroy();

      queues.delete(guildId);
    });

    voiceConnection.subscribe(queue.#audioPlayer);

    return queue;
  }

  enqueue(track) {
    this.tracks.push(track);

    this.#process();
  }

  skip() {
    let track = null;

    if (this.#audioPlayer.state.status !== AudioPlayerStatus.Idle) {
      track = this.#audioPlayer.state.resource.metadata;
    }

    this.#audioPlayer.stop(true);

    return track;
  }

  clear() {
    this.skip();
    this.tracks = [];
  }

  #destroy() {
    this.tracks = [];
    this.#audioPlayer = null;
  }

  async #process() {
    if (this.#audioPlayer.state.status !== AudioPlayerStatus.Idle) return;

    const track = this.tracks.shift();

    if (!track) return;

    try {
      const audio = await downloadTrack(track);

      this.#audioPlayer.play(audio);
    } catch (error) {
      console.error(error);

      await track.interaction?.followUp(
        "Oops! I was unable to play that track.",
      );

      this.#process();
    }
  }
}
