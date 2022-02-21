import { Song } from "../domain/song";
import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import {
  NoMusicError,
  YoutubeDownloadError,
} from "@common/errors/music.errors";
import { IChat } from "@common/typedefs/chat";
import { IAudioPlayer, IStreamingSource } from "@music/app/ports/music";
import { IDiscordConnection } from "../../common/typedefs/discord-connection";
import {
  bold,
  underline,
} from "@common/infrastructure/providers/discord/markdown";
import { ISongQueue } from "./ports/song-queue";

export class MusicPlayerService {
  private currentSong: Song;

  constructor(
    private readonly streamingSource: IStreamingSource,
    private readonly discord: IDiscordConnection,
    private readonly chat: IChat,
    private readonly audioPlayer: IAudioPlayer,
    private readonly songQueue: ISongQueue
  ) {
    /**
     * Idle state event callback only starts after something was already
     * played.
     */

    this.audioPlayer.handleStatusChange(AudioPlayerStatus.Idle, async () => {
      this.currentSong = null;
      await this.checkQueue();
    });
  }

  async play(link: string): Promise<Song> {
    const details = await this.streamingSource.getInfo(link);
    const song = new Song(details);

    this.audioPlayer.ensureVoiceChatConnection();

    await this.enqueueSong(song);
    return song;
  }

  async pause() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }

    return this.audioPlayer.pause();
  }

  async resume() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }

    this.audioPlayer.resume();
  }

  async skip() {
    if (
      this.audioPlayer.status() !== AudioPlayerStatus.Playing ||
      !this.currentSong
    ) {
      throw new NoMusicError("No song is currently being played.");
    }

    await this.pause();
    await this.checkQueue();
    await this.resume();
  }

  async getQueue() {
    return await this.songQueue.getQueue();
  }

  async startAgain() {
    if (!this.currentSong) {
      await this.checkQueue();
    }
  }

  private async enqueueSong(song: Song) {
    await this.songQueue.enqueue(song);

    if (this.audioPlayer.status() === AudioPlayerStatus.Idle) {
      await this.checkQueue();
    }
  }

  /**
   * Checks queue for next song, if exists - download and play it.
   * Disconnects from the voice chat if queue's empty.
   * @private
   */
  private async checkQueue() {
    const connection = this.discord.getVoiceChatConnection();
    const queueLength = await this.songQueue.count();

    if (queueLength === 0) {
      return connection.disconnect();
    }

    try {
      this.currentSong = await this.songQueue.dequeue();
      const audioFile = await this.streamingSource.download(this.currentSong);

      const resource = createAudioResource(audioFile);
      this.audioPlayer.play(resource);

      /**
       * Slightly throttle sending a message to prevent showing first 'Playing" before 'Queued' when
       * there are no songs in the queue.
       */
      setTimeout(() => {
        void this.chat.reply(
          `Now playing: ${bold(underline(this.currentSong.title))}`
        );
      }, 1000);
    } catch (error) {
      if (error instanceof YoutubeDownloadError) {
        await this.chat.reply(error.message);
      } else {
        console.log(error);

        await this.chat.fallback();
      }
    }
  }
}
