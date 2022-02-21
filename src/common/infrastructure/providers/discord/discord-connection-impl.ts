import DiscordVoice, { VoiceConnection } from "@discordjs/voice";
import {
  Client,
  GuildMember,
  InternalDiscordGatewayAdapterCreator,
} from "discord.js";
import { ConnectionToVoiceChatNotFoundError } from "@common/errors/common.errors";
import { IDiscordConnection } from "@common/typedefs/discord-connection";

export class DiscordConnection implements IDiscordConnection {
  client: Client;
  currentUser: GuildMember;
  channelId: string;
  guildId: string;

  voiceAdapterCreator: InternalDiscordGatewayAdapterCreator;

  createVoiceChatConnection(): VoiceConnection {
    if (!this.isUserOnVoiceChat()) {
      throw new ConnectionToVoiceChatNotFoundError();
    }

    return DiscordVoice.joinVoiceChannel({
      channelId: this.currentUser.voice.channel.id,
      guildId: this.guildId,
      adapterCreator: this.voiceAdapterCreator,
    });
  }

  getVoiceChatConnection(): VoiceConnection {
    return DiscordVoice.getVoiceConnection(this.guildId);
  }

  disconnectFromVoiceChat(): boolean {
    const connection = this.getVoiceChatConnection();
    return connection?.disconnect();
  }

  isUserOnVoiceChat(): boolean {
    return !!this.currentUser.voice.channel;
  }
}
