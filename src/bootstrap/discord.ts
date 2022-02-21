import { Client, Intents } from "discord.js";
import { helloInteractor } from "../hello";
import { SlashCommandPublisher } from "@common/infrastructure/providers/discord/slash-commands/slash-commands.publisher";
import { SlashCommandRegistry } from "@common/infrastructure/providers/discord/slash-commands/slash-commands.registry";
import { DiscordConnection } from "@common/infrastructure/providers/discord/discord-connection-impl";
import { DiscordChat } from "@common/infrastructure/providers/discord/chat/discord-chat";
import { slashCommandsInteractor } from "@common/infrastructure/providers/discord";

export const slashCommandRegistry = new SlashCommandRegistry();
export const discordConnection = new DiscordConnection();
export const discordChat = new DiscordChat(discordConnection);

export async function bootstrapDiscord() {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  discordConnection.client = client;

  helloInteractor({
    client,
    mode: "once",
    event: "ready",
  });

  slashCommandsInteractor({
    client,
    mode: "on",
    event: "interactionCreate",
  });

  await new SlashCommandPublisher(slashCommandRegistry).deploy();

  return client;
}
