import ytdl from "ytdl-core-discord";
import { videoInfo } from "ytdl-core";
import { YoutubeLink } from "./youtube-link";
import { Song } from "./song";
import { YoutubeDownloadError } from "../common/errors/music.errors";
import { IYoutubeService } from "../common/typedefs/music";

export class YoutubeService implements IYoutubeService {
  async getInfo(link: YoutubeLink): Promise<videoInfo | null> {
    return ytdl.getBasicInfo(link.value);
  }

  async download(song: Song) {
    try {
      return ytdl(song.url.value, { highWaterMark: 1 << 27 });
    } catch {
      throw new YoutubeDownloadError(
        `Couldn't download this song: ${song.title}`
      );
    }
  }
}
