import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { AudioPlayerService } from "@music/audio-player.service";
import { MusicPlayerService } from "@music/music-player.service";
import { CommandInteraction } from "discord.js";

export class JoinVoiceCommand extends SlashCommand {
  public name = "join-voice";
  public description = "Invite tadeusz to your voice chat";
  public options = [];

  constructor(
    private readonly audioPlayerService: AudioPlayerService,
    private musicPlayerService: MusicPlayerService
  ) {
    super();
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    this.audioPlayerService.ensureVoiceChatConnection();
    await this.musicPlayerService.startAgain();
  }
}
