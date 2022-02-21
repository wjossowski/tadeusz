import { TextChannel } from "discord.js";
import { IDiscordConnection } from "@common/typedefs/connection";
import { UNKNOWN_ERROR_CHAT_MESSAGE } from "@common/utils/const";

export class MessagingService {
  constructor(private readonly discordConnection: IDiscordConnection) {}

  async sendMessage(content: string) {
    const channel = this.getChannelInstance();
    await channel.send(content);
  }

  async sendDefaultErrorMessage() {
    const channel = this.getChannelInstance();
    await channel.send(UNKNOWN_ERROR_CHAT_MESSAGE);
  }

  private getChannelInstance(): TextChannel {
    const client = this.discordConnection.client;
    const channelId = this.discordConnection.channelId;
    return client.channels.cache.get(channelId) as TextChannel;
  }
}
