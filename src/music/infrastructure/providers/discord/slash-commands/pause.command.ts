import { NoMusicError } from "@common/errors/music.errors";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { IMessagingService } from "@common/typedefs/discord";
import { MusicPlayerService } from "@music/music-player.service";
import { CommandInteraction } from "discord.js";

export class PauseCommand extends SlashCommand {
  public name = "pause";
  public description = "Pause current song";
  public options = [];

  constructor(
    private readonly musicPlayerService: MusicPlayerService,
    private readonly messagingService: IMessagingService
  ) {
    super();
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await this.musicPlayerService.pause();
      return this.messagingService.sendMessage(
        `Song has been paused by ${interaction.user.username}`
      );
    } catch (error) {
      if (error instanceof NoMusicError) {
        return this.messagingService.sendMessage(error.message);
      } else {
        console.error(error);
        return this.messagingService.sendDefaultErrorMessage();
      }
    }
  }
}
