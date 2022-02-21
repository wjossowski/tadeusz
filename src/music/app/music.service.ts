import { Song } from "../domain/song";
import { AudioPlayerStatus } from "@discordjs/voice";
import { YoutubeDownloadError } from "@common/errors/music.errors";
import { IChat } from "@common/typedefs/chat";
import {
  bold,
  underline,
} from "@common/infrastructure/providers/discord/markdown";
import { ISongQueue } from "./ports/song-queue";
import { IStreamingSource } from "./ports/streaming-source";
import { IAudioPlayer } from "./ports/audio-player";

export class MusicService {
  constructor(
    private readonly streamingSource: IStreamingSource,
    private readonly audioPlayer: IAudioPlayer,
    private readonly songQueue: ISongQueue,
    private readonly chat: IChat
  ) {
    this.audioPlayer.handleStatusChange(AudioPlayerStatus.Idle, async () => {
      await this.checkQueue();
    });
  }

  async play(link: string): Promise<Song> {
    const details = await this.streamingSource.getInfo(link);
    const song = new Song(details);
    await this.enqueueSong(song);
    return song;
  }

  async skip() {
    await this.pause();
    await this.checkQueue();
    await this.resume();
  }

  async pause() {
    return this.audioPlayer.pause();
  }

  async resume() {
    this.audioPlayer.resume();
  }

  async getQueue() {
    return await this.songQueue.getQueue();
  }

  async setup() {
    if (!this.audioPlayer.isPlaying()) {
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
    const queueLength = await this.songQueue.count();
    if (queueLength === 0) {
      return this.audioPlayer.stop();
    }

    try {
      const song = await this.songQueue.dequeue();
      const audioFile = await this.streamingSource.download(song);
      this.audioPlayer.play(audioFile);

      /**
       * Slightly throttle sending a message
       * to prevent showing first 'Playing" before 'Queued'
       * when there are no songs in the queue.
       */
      setTimeout(() => {
        void this.chat.reply(`Now playing: ${bold(underline(song.title))}`);
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
