import { MessageFlags, SlashCommandBuilder } from "discord.js";
import Queue from "../queue.js";

export default {
  info: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops playback and clears the queue."),

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

      queue.clear();

      await interaction.reply({
        content: "Stopping playback and clearing the queue.",
        flags: MessageFlags.Ephemeral,
      });
    } catch {
      await interaction.reply({
        content: "Oops, I couldn't join the voice channel.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
