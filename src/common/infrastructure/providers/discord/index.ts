import { DiscordConnection } from "./discord-connection-impl";
import { DiscordChat } from "./chat/discord-chat";
import { SlashCommandRegistry } from "./slash-commands/slash-commands.registry";
import { IInteractorConfig, InteractorFactory } from "./interactor";
import { SlashCommandsInteractor } from "./slash-commands/slash-commands.interactor";

export const discordConnection = new DiscordConnection();
export const discordChat = new DiscordChat(discordConnection);
export const slashCommandRegistry = new SlashCommandRegistry();

export const slashCommandsInteractor: InteractorFactory<SlashCommandsInteractor> =
  (config: IInteractorConfig) =>
    new SlashCommandsInteractor(
      config,
      slashCommandRegistry,
      discordConnection,
      discordChat
    );
