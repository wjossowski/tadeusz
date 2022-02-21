import { NoMusicError } from "@common/errors/music.errors";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { IChat } from "@common/typedefs/chat";
import { MusicService } from "@music/app/music.service";
import { CommandInteraction } from "discord.js";

export class SkipCommand extends SlashCommand {
  constructor(
    private readonly musicPlayerService: MusicService,
    private readonly chat: IChat
  ) {
    super({ name: "skip", description: "Skip current song", options: [] });
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    try {
      await this.musicPlayerService.skip();
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
