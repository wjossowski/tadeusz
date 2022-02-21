import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { IAudioPlayer } from "@music/app/ports/audio-player";
import { IAudioAPI } from "@music/app/ports/audio-api";
import { Song } from "@music/domain/song";
import { NoMusicError } from "@common/errors/music.errors";
import { Readable } from "stream";
import { IAudioConnection } from "@music/app/ports/audio-connection";

export class DiscordAudioPlayer implements IAudioPlayer {
  private currentSong: Song;

  constructor(
    private readonly audioConnection: IAudioConnection,
    private readonly audioApi: IAudioAPI
  ) {
    this.handleStatusChange(AudioPlayerStatus.Idle, async () => {
      this.currentSong = null;
    });
  }

  public handleStatusChange(status, listener) {
    this.audioApi.on(status, listener);
  }

  public isPlaying() {
    return !!this.currentSong;
  }

  public play(source: Readable) {
    this.audioConnection.ensureConnection();
    const resource = createAudioResource(source);
    return this.audioApi.play(resource);
  }

  public pause() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }
    if (this.status() !== AudioPlayerStatus.Playing) {
      throw new NoMusicError("No song is currently being played.");
    }
    return this.audioApi.pause();
  }

  public resume() {
    if (!this.currentSong) {
      throw new NoMusicError("No song is currently being played.");
    }
    return this.audioApi.unpause();
  }

  public stop() {
    return this.audioConnection.disconnect();
  }

  public status() {
    return this.audioApi.state.status;
  }
}
