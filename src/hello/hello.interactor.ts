import {
  AbstractDiscordInteractor,
  IInteractorConfig,
} from "../common/infrastructure/providers/discord/interactor";
import { Interaction } from "discord.js";

export class HelloInteractor extends AbstractDiscordInteractor {
  constructor(props: IInteractorConfig) {
    super(props);
  }

  // When the client is ready, run this code (only once)
  execute(_interaction: Interaction): void {
    console.log(`Tadeusz is ready as ${this.client.user.tag}.`);
  }
}
