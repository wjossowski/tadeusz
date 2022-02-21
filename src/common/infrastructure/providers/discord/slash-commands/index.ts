import { SlashCommandRepository } from "./slash-commands.repository";
import { SlashCommandsInteractor } from "./slash-commands.interactor";
import { IInteractorConfig } from "@common/utils/interactor";
import { InteractorFactory } from "@common/typedefs/common";
import { connectionService } from "..";
import { messagingService } from "../messaging";

// Repositories
export const slashCommandRepository = new SlashCommandRepository();

// Interactors
export const slashCommandsInteractor: InteractorFactory<SlashCommandsInteractor> =
  (config: IInteractorConfig) =>
    new SlashCommandsInteractor(
      config,
      slashCommandRepository,
      connectionService,
      messagingService
    );
