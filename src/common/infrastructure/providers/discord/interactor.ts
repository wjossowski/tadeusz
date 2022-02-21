import { Client, ClientEvents, Interaction } from "discord.js";

export interface IInteractorConfig {
  client: Client;
  mode: "on" | "once";
  event: keyof ClientEvents;
}

export abstract class AbstractDiscordInteractor {
  protected readonly client: Client;
  protected readonly mode: "on" | "once";
  protected readonly event: keyof ClientEvents;

  protected constructor({ client, mode, event }: IInteractorConfig) {
    this.client = client;
    this.mode = mode;
    this.event = event;

    client[mode](event, this.execute.bind(this));
  }

  public abstract execute(interaction: Interaction): any;
}

export type InteractorFactory<T> = (config: IInteractorConfig) => T;
