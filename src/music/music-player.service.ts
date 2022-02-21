import { YoutubeLink } from "./infrastructure/providers/youtube-dl/youtube-link";
import { Song } from "./domain/song";
import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import {
  NoMusicError,
  YoutubeDownloadError,
} from "@common/errors/music.errors";
import { IMessagingService } from "@common/typedefs/discord";
import {
  IAudioPlayerService,
  IMusicPlayerService,
  IYoutubeService,
} from "@music/app/ports/music";
import { IDiscordConnection } from "../common/typedefs/connection";
import { bold, underline } from "@common/presenters/markdown";
import { ISongQueue } from "./app/ports/song-queue";

export class MusicPlayerService implements IMusicPlayerService {
  private currentSong: Song;

  constructor(
    private readonly youtubeService: IYoutubeService,
    private readonly discordConnection: IDiscordConnection,
    private readonly messagingService: IMessagingService,
    private readonly audioPlayerService: IAudioPlayerService,
    private readonly musicQueueService: ISongQueue
  ) {
    /**
     * Idle state event callback only starts after something was already
     * played.
     */

    this.audioPlayerService.handleStatusChange(
      AudioPlayerStatus.Idle,
      async () => {
        this.currentSong = null;
        await this.checkQueue();
      }
    );
  }

  async play(link: YoutubeLink): Promise<Song> {
    const { videoDetails: details } = await this.youtubeService.getInfo(link);
    const song = Song.fromVideoDetails(details);

    this.audioPlayerService.ensureVoiceChatConnection();

    await this.enqueueSong(song);
    return song;
  }

  async pause() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }

    return this.audioPlayerService.pause();
  }

  async resume() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }

    this.audioPlayerService.resume();
  }

  async skip() {
    if (
      this.audioPlayerService.status() !== AudioPlayerStatus.Playing ||
      !this.currentSong
    ) {
      throw new NoMusicError("No song is currently being played.");
    }

    await this.pause();
    await this.checkQueue();
    await this.resume();
  }

  async getQueue() {
    return await this.musicQueueService.getQueue();
  }

  async startAgain() {
    if (!this.currentSong) {
      await this.checkQueue();
    }
  }

  private async enqueueSong(song: Song) {
    await this.musicQueueService.enqueue(song);

    if (this.audioPlayerService.status() === AudioPlayerStatus.Idle) {
      await this.checkQueue();
    }
  }

  /**
   * Checks queue for next song, if exists - download and play it.
   * Disconnects from the voice chat if queue's empty.
   * @private
   */
  private async checkQueue() {
    const connection = this.discordConnection.getVoiceChatConnection();
    const queueLength = await this.musicQueueService.getQueueLength();

    if (queueLength === 0) {
      return connection.disconnect();
    }

    try {
      this.currentSong = await this.musicQueueService.dequeue();
      const audioFile = await this.youtubeService.download(this.currentSong);

      const resource = createAudioResource(audioFile);
      this.audioPlayerService.play(resource);

      /**
       * Slightly throttle sending a message to prevent showing first 'Playing" before 'Queued' when
       * there are no songs in the queue.
       */
      setTimeout(() => {
        void this.messagingService.sendMessage(
          `Now playing: ${bold(underline(this.currentSong.title))}`
        );
      }, 1000);
    } catch (error) {
      if (error instanceof YoutubeDownloadError) {
        await this.messagingService.sendMessage(error.message);
      } else {
        console.log(error);

        await this.messagingService.sendDefaultErrorMessage();
      }
    }
  }
}
