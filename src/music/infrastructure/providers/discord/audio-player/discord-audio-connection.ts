import { IDiscordConnection } from "@common/typedefs/discord-connection";
import { AudioPlayer, VoiceConnectionStatus } from "@discordjs/voice";
import { IAudioAPI } from "@music/app/ports/audio-api";
import { IAudioConnection } from "@music/app/ports/audio-connection";

export class DiscordAudioConnection implements IAudioConnection {
  constructor(
    private readonly discord: IDiscordConnection,
    private readonly audioApi: IAudioAPI
  ) {}

  public isActive(): boolean {
    return !!this.discord.getVoiceChatConnection();
  }

  public disconnect() {
    const connection = this.discord.getVoiceChatConnection();
    if (connection) {
      connection.disconnect();
    }
  }

  public ensureConnection() {
    const connection = this.discord.getVoiceChatConnection();

    if (!connection) {
      const connection = this.connect();
      connection.subscribe(this.audioApi as AudioPlayer);
    }
  }

  private connect() {
    const connection = this.discord.createVoiceChatConnection();

    // Cleanup (i.e on kick)
    connection.on(VoiceConnectionStatus.Disconnected, () => {
      connection.destroy();
    });

    return connection;
  }
}
