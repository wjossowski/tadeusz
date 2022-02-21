import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export interface ISlashCommandOption {
  name: string;
  description: string;
  required: boolean;
}

export abstract class SlashCommand {
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract readonly options: ISlashCommandOption[];

  private commandBody: any;

  constructor() {
    this.setup();
  }

  /**
   * Code executed after command has been typed
   */
  public abstract execute(interaction: CommandInteraction): Promise<void>;

  public get body() {
    return this.commandBody;
  }

  private setup() {
    this.commandBody = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);

    this.options.forEach((option) =>
      this.commandBody.addStringOption((optionBuilder) =>
        optionBuilder
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
      )
    );
  }
}
