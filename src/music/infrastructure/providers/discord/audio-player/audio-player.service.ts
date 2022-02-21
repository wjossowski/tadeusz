import { IAudioAPI, IAudioPlayerService } from "@music/app/ports/music";
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { IDiscordConnection } from "@common/typedefs/connection";

export class AudioPlayerService implements IAudioPlayerService {
  constructor(
    private readonly discordConnection: IDiscordConnection,
    private readonly audioPlayer: IAudioAPI
  ) {}

  public ensureVoiceChatConnection() {
    const connection = this.discordConnection.getVoiceChatConnection();

    if (!connection) {
      const connection = this.connect();
      connection.subscribe(this.audioPlayer as AudioPlayer);
      return;
    }

    if (this.status() === AudioPlayerStatus.Paused) {
      this.resume();
    }
  }

  public handleStatusChange(status, listener) {
    this.audioPlayer.on(status, listener);
  }

  play(resource: AudioResource<unknown>) {
    return this.audioPlayer.play(resource);
  }

  pause() {
    return this.audioPlayer.pause();
  }

  resume() {
    return this.audioPlayer.unpause();
  }

  status() {
    return this.audioPlayer.state.status;
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
