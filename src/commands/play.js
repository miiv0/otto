import { SlashCommandBuilder } from "discord.js";
import { createTrackEmbed } from "../embeds.js";
import Queue from "../queue.js";
import { resolveQuery } from "../resolver/index.js";

export default {
  info: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays an audio track.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("A search query or URL.")
        .setRequired(true),
    ),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice?.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "I can't join you unless you're in a voice channel.",
        ephemeral: true,
      });

      return;
    }

    try {
      const queue = Queue.join(voiceChannel);

      await interaction.deferReply();

      const query = interaction.options.getString("query", true);

      try {
        const track = await resolveQuery(query);

        queue.enqueue(track);

        await interaction.editReply({
          embeds: [
            createTrackEmbed(track, { title: "Queued", thumbnail: true }),
          ],
        });
      } catch {
        await interaction.editReply("Oops, I couldn't find anything.");
      }
    } catch {
      await interaction.reply({
        content: "Oops, I couldn't join the voice channel.",
        ephemeral: true,
      });
    }
  },
};
