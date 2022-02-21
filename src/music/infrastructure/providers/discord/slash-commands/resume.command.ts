import { NoMusicError } from "@common/errors/music.errors";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { IMessagingService } from "@common/typedefs/discord";
import { MusicPlayerService } from "@music/music-player.service";
import { CommandInteraction } from "discord.js";

export class ResumeCommand extends SlashCommand {
  public name = "resume";
  public description = "Resume paused song";
  public options = [];

  constructor(
    private readonly musicPlayerService: MusicPlayerService,
    private readonly messagingService: IMessagingService
  ) {
    super();
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    try {
      await this.musicPlayerService.resume();
      return this.messagingService.sendMessage("Song resumed.");
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
