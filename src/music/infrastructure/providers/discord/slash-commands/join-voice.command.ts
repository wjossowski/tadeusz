import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { MusicService } from "@music/app/music.service";
import { CommandInteraction } from "discord.js";

export class JoinVoiceCommand extends SlashCommand {
  constructor(private musicPlayerService: MusicService) {
    super({
      name: "join-voice",
      description: "Invite tadeusz to your voice chat",
      options: [],
    });
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    await this.musicPlayerService.setup();
  }
}
