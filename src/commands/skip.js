import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { createTrackEmbed } from "../embeds.js";
import Queue from "../queue.js";

export default {
  info: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current track."),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "I can't join you unless you're in a voice channel.",
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    try {
      const queue = Queue.join(voiceChannel);

      const track = queue.skip();

      if (track) {
        await interaction.reply({
          embeds: [
            createTrackEmbed(track, { title: "Skipped", thumbnail: true }),
          ],
        });
      } else {
        await interaction.reply({
          content: "There's nothing playing at the moment.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch {
      await interaction.reply({
        content: "Oops, I couldn't join the voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
