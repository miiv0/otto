import { Innertube, UniversalCache, YTNodes } from "youtubei.js";

export class YouTubeTrackResolver {
  #youtube;

  async #createSession() {
    if (this.#youtube) return this.#youtube;

    const youtube = await Innertube.create({
      cache: new UniversalCache(),
      retrieve_player: false,
    });

    this.#youtube = youtube;

    return youtube;
  }

  #parseQuery(query) {
    const pattern =
      /https:\/\/(:?.*\.)?youtube.com\/watch\?v=(?<id>[a-zA-Z0-9_-]+)/;
    const found = query.match(pattern);

    if (!found) {
      return {
        type: "search",
        query,
      };
    }

    const { id } = found.groups;

    return {
      type: "video",
      id,
    };
  }

  async resolve(query) {
    const youtube = await this.#createSession();

    const result = this.#parseQuery(query);

    switch (result.type) {
      case "video": {
        const id = result.id;
        const video = await youtube.getInfo(id);

        const author = video.secondary_info.owner?.author ?? null;

        return {
          url: `https://www.youtube.com/watch?v=${id}`,
          title: video.basic_info.title,
          duration: video.basic_info.duration,
          author: author
            ? {
                name: author.name,
                url: author.url,
                image: author.thumbnails[0]?.url ?? null,
              }
            : null,
          image: video.basic_info.thumbnail[0]?.url ?? null,
          youtube: { id },
        };
      }
      case "search": {
        const results = (await youtube.search(result.query, { type: "video" }))
          .results;
        const video = results.filterType(YTNodes.Video).first();

        if (!video) return null;

        return {
          url: `https://www.youtube.com/watch?v=${video.video_id}`,
          title: video.title.text,
          author: video.author
            ? {
                name: video.author.name,
                url: video.author.url,
                image: video.author.thumbnails[0]?.url ?? null,
              }
            : null,
          image: video.thumbnails[0]?.url ?? null,
          youtube: { id: video.id },
        };
      }
    }

    return null;
  }
}
