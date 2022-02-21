import { TextChannel } from "discord.js";
import { IConnectionService } from "@common/typedefs/connection";
import { UNKNOWN_ERROR_CHAT_MESSAGE } from "@common/utils/const";

export class MessagingService {
  constructor(private readonly connectionService: IConnectionService) {}

  async sendMessage(content: string) {
    const channel = this.getChannelInstance();
    await channel.send(content);
  }

  async sendDefaultErrorMessage() {
    const channel = this.getChannelInstance();
    await channel.send(UNKNOWN_ERROR_CHAT_MESSAGE);
  }

  private getChannelInstance(): TextChannel {
    const client = this.connectionService.client;
    const channelId = this.connectionService.channelId;
    return client.channels.cache.get(channelId) as TextChannel;
  }
}
