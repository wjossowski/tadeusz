import { SlashCommandRepository } from "./slash-commands.repository";
import { SlashCommandsInteractor } from "./slash-commands.interactor";
import { IInteractorConfig, InteractorFactory } from "@common/utils/interactor";
import { discordConnection } from "..";
import { messagingService } from "../messaging";

// Repositories
export const slashCommandRepository = new SlashCommandRepository();

// Interactors
export const slashCommandsInteractor: InteractorFactory<SlashCommandsInteractor> =
  (config: IInteractorConfig) =>
    new SlashCommandsInteractor(
      config,
      slashCommandRepository,
      discordConnection,
      messagingService
    );
