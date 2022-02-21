import { TextChannel } from "discord.js";
import { IDiscordConnection } from "@common/typedefs/discord-connection";
import { UNKNOWN_ERROR_CHAT_MESSAGE } from "./fallback";
import { IChat } from "@common/typedefs/chat";

export class DiscordChat implements IChat {
  constructor(private readonly discordConnection: IDiscordConnection) {}

  public async reply(content: string): Promise<void> {
    const channel = this.getChannelInstance();
    await channel.send(content);
  }

  public async fallback(): Promise<void> {
    const channel = this.getChannelInstance();
    await channel.send(UNKNOWN_ERROR_CHAT_MESSAGE);
  }

  private getChannelInstance(): TextChannel {
    const client = this.discordConnection.client;
    const channelId = this.discordConnection.channelId;
    return client.channels.cache.get(channelId) as TextChannel;
  }
}
