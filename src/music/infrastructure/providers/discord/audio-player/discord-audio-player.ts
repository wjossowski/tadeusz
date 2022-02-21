import { IAudioAPI, IAudioPlayerService } from "@music/app/ports/music";
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { IDiscordConnection } from "@common/typedefs/connection";

export class DiscordAudioPlayer implements IAudioPlayerService {
  constructor(
    private readonly discordConnection: IDiscordConnection,
    private readonly audioApi: IAudioAPI
  ) {}

  public ensureVoiceChatConnection() {
    const connection = this.discordConnection.getVoiceChatConnection();

    if (!connection) {
      const connection = this.connect();
      connection.subscribe(this.audioApi as AudioPlayer);
      return;
    }

    if (this.status() === AudioPlayerStatus.Paused) {
      this.resume();
    }
  }

  public handleStatusChange(status, listener) {
    this.audioApi.on(status, listener);
  }

  play(resource: AudioResource<unknown>) {
    return this.audioApi.play(resource);
  }

  pause() {
    return this.audioApi.pause();
  }

  resume() {
    return this.audioApi.unpause();
  }

  status() {
    return this.audioApi.state.status;
  }

  private connect() {
    const connection = this.discordConnection.createVoiceChatConnection();

    // Cleanup (i.e on kick)
    connection.on(VoiceConnectionStatus.Disconnected, () => {
      connection.destroy();
    });

    return connection;
  }
}
