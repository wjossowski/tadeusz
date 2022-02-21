import config from "@common/config/config";
import { Routes } from "discord-api-types/v9";
import { SlashCommandRegistry } from "./slash-commands.registry";

const { REST } = require("@discordjs/rest");

export class SlashCommandPublisher {
  constructor(private readonly repository: SlashCommandRegistry) {}

  /**
   * Deploys command to discord
   */
  public async deploy() {
    const rest = new REST({ version: "9" }).setToken(config.DISCORD_BOT_TOKEN);

    return rest
      .put(
        Routes.applicationGuildCommands(
          config.DISCORD_CLIENT_ID,
          config.DISCORD_GUILD_ID
        ),
        {
          body: this.repository.getRawCommands(),
        }
      )
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);
  }
}
