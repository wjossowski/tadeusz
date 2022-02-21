import { SlashCommandRegistry } from "./slash-commands.repository";
import { SlashCommandsInteractor } from "./slash-commands.interactor";
import {
  IInteractorConfig,
  InteractorFactory,
} from "@common/infrastructure/providers/discord/interactor";
import { discordConnection } from "..";
import { discordChat } from "../messaging";

// Repositories
export const slashCommandRegistry = new SlashCommandRegistry();

// Interactors
export const slashCommandsInteractor: InteractorFactory<SlashCommandsInteractor> =
  (config: IInteractorConfig) =>
    new SlashCommandsInteractor(
      config,
      slashCommandRegistry,
      discordConnection,
      discordChat
    );
