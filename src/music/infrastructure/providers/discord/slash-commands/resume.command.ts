import { NoMusicError } from "@common/errors/music.errors";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { IChat } from "@common/typedefs/chat";
import { MusicPlayerService } from "@music/app/music-player.service";
import { CommandInteraction } from "discord.js";

export class ResumeCommand extends SlashCommand {
  constructor(
    private readonly musicPlayerService: MusicPlayerService,
    private readonly chat: IChat
  ) {
    super({
      name: "resume",
      description: "Resume paused song",
      options: [],
    });
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    try {
      await this.musicPlayerService.resume();
      return this.chat.reply("Song resumed.");
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
