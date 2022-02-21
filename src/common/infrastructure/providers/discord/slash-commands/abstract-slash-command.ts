import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export interface ISlashCommandOption {
  name: string;
  description: string;
  required: boolean;
}

export type SlashCommandConfig = {
  name: string;
  description: string;
  options: ISlashCommandOption[];
};

export abstract class SlashCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly options: ISlashCommandOption[];

  private commandBody: any;

  constructor(config: SlashCommandConfig) {
    this.name = config.name;
    this.description = config.description;
    this.options = config.options;
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

  /**
   * Code executed after command has been typed
   */
  public abstract execute(interaction: CommandInteraction): Promise<void>;

  public get body() {
    return this.commandBody;
  }
}
