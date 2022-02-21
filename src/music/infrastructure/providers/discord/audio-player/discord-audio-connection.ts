import { IDiscordConnection } from "@common/typedefs/discord-connection";
import { AudioPlayer, VoiceConnectionStatus } from "@discordjs/voice";
import { IAudioAPI } from "@music/app/ports/audio-api";
import { IAudioConnection } from "@music/app/ports/audio-connection";

export class DiscordAudioConnection implements IAudioConnection {
  constructor(
    private readonly discordConnection: IDiscordConnection,
    private readonly audioApi: IAudioAPI
  ) {}

  public isActive(): boolean {
    return !!this.discordConnection.getVoiceChatConnection();
  }

  public ensureVoiceChatConnection() {
    const connection = this.discordConnection.getVoiceChatConnection();

    if (!connection) {
      const connection = this.connect();
      connection.subscribe(this.audioApi as AudioPlayer);
    }
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
