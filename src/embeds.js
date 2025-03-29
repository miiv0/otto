import { EmbedBuilder } from "discord.js";
import { Duration } from "luxon";

const OTTO_COLOR = 0xff615e;

export const createTrackEmbed = (track, options = {}) => {
  const { title = "", thumbnail = false } = options;

  const embed = new EmbedBuilder()
    .setColor(OTTO_COLOR)
    .setTitle(title)
    .setDescription(`[${track.title}](${track.url})`)
    .setAuthor(
      track.author
        ? {
            name: track.author.name,
            url: track.author.url,
            iconURL: track.author.image,
          }
        : null,
    )
    .setFooter(
      track.duration
        ? { text: Duration.fromObject({ seconds: track.duration }).toISOTime() }
        : null,
    );

  thumbnail ? embed.setThumbnail(track.image) : embed.setThumbnail(track.image);

  return embed;
};
