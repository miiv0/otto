import { SlashCommandBuilder } from "discord.js";
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
    await interaction.deferReply();

    const query = interaction.options.getString("query", true);
    const track = await resolveQuery(query);

    await interaction.editReply(`Playing ${track.title}.`);
  },
};
