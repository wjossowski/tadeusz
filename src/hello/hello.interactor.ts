import { Interactor, IInteractorConfig } from "../common/utils/interactor";
import { Interaction } from "discord.js";

export class HelloInteractor extends Interactor {
  constructor(props: IInteractorConfig) {
    super(props);
  }

  // When the client is ready, run this code (only once)
  execute(interaction: Interaction): void {
    console.log(`Tadeusz is ready as ${this.client.user.tag}.`);
  }
}
