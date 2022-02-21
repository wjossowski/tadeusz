import { NoMusicError } from "@common/errors/music.errors";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { IChat } from "@common/typedefs/chat";
import { MusicService } from "@music/app/music.service";
import { CommandInteraction } from "discord.js";

export class PauseCommand extends SlashCommand {
  constructor(
    private readonly musicPlayerService: MusicService,
    private readonly chat: IChat
  ) {
    super({
      name: "pause",
      description: "Pause current song",
      options: [],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await this.musicPlayerService.pause();
      return this.chat.reply(
        `Song has been paused by ${interaction.user.username}`
      );
    } catch (error) {
      if (error instanceof NoMusicError) {
        return this.chat.reply(error.message);
      } else {
        console.error(error);
        return this.chat.fallback();
      }
    }
  }
}
