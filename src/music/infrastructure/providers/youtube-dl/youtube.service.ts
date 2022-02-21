import ytdl from "ytdl-core-discord";
import {
  InvalidYoutubeLinkError,
  YoutubeDownloadError,
} from "@common/errors/music.errors";
import { IYoutubeService } from "@music/app/ports/music";
import { Song, SongDetails } from "@music/domain/song";

export class YoutubeService implements IYoutubeService {
  async getInfo(url: string): Promise<SongDetails | null> {
    this.assert(url);
    const { videoDetails } = await ytdl.getBasicInfo(url);
    return {
      id: videoDetails.videoId,
      title: videoDetails.title,
      url: videoDetails.video_url,
      isPrivate: videoDetails.isPrivate,
    };
  }

  async download(song: Song) {
    this.assert(song.url);
    try {
      return ytdl(song.url, { highWaterMark: 1 << 27 });
    } catch {
      throw new YoutubeDownloadError(
        `Couldn't download this song: ${song.title}`
      );
    }
  }

  private assert(url: string) {
    if (!ytdl.validateURL(url)) {
      throw new InvalidYoutubeLinkError(
        `Invalid youtube link provided: ${url}`
      );
    }
  }
}
