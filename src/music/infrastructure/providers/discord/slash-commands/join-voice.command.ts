import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { MusicPlayerService } from "@music/app/music-player.service";
import { CommandInteraction } from "discord.js";
import { IAudioPlayer } from "@music/app/ports/music";

export class JoinVoiceCommand extends SlashCommand {
  public name = "join-voice";
  public description = "Invite tadeusz to your voice chat";
  public options = [];

  constructor(
    private readonly audioPlayerService: IAudioPlayer,
    private musicPlayerService: MusicPlayerService
  ) {
    super();
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    this.audioPlayerService.ensureVoiceChatConnection();
    await this.musicPlayerService.startAgain();
  }
}
