import { SlashCommandBuilder } from "discord.js";

export default {
  info: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays an audio track."),
  async execute(interaction) {
    await interaction.reply("Playing track...");
  },
};
