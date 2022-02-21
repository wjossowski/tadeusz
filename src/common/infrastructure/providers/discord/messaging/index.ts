import { DiscordChat } from "./discord-chat";
import { discordConnection } from "@common/infrastructure/providers/discord";

export const discordChat = new DiscordChat(discordConnection);
