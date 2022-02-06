import { AudioAPI } from "../typedefs/music";
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { ConnectionService } from "../connection/connection.service";

export class AudioPlayerService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly audioPlayer: AudioAPI
  ) {}

  public ensureVoiceChatConnection() {
    const connection = this.connectionService.getVoiceChatConnection();

    if (!connection) {
      const connection = this.createConnection();
      connection.subscribe(this.audioPlayer as AudioPlayer);
      return;
    }

    if (this.getPlayerStatus() === AudioPlayerStatus.Paused) {
      this.unpausePlayer();
    }
  }

  public registerAction(status, listener) {
    console.log(status, listener);

    this.audioPlayer.on(status, listener);
  }

  playPlayer(resource: AudioResource<unknown>) {
    return this.audioPlayer.play(resource);
  }

  pausePlayer() {
    return this.audioPlayer.pause();
  }

  unpausePlayer() {
    return this.audioPlayer.unpause();
  }

  getPlayerStatus() {
    return this.audioPlayer.state.status;
  }

  private createConnection() {
    const connection = this.connectionService.createVoiceChatConnection();

    // Cleanup (i.e on kick)
    connection.on(VoiceConnectionStatus.Disconnected, () => {
      connection.destroy();
    });

    return connection;
  }
}
