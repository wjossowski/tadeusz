import { CommandInteraction } from "discord.js";
import {
  ISlashCommandOption,
  SlashCommand,
} from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { underline, bold } from "@common/presenters/markdown";
import { IMessagingService } from "@common/typedefs/discord";
import { UNKNOWN_ERROR_CHAT_MESSAGE } from "@common/utils/const";
import { MusicPlayerService } from "@music/music-player.service";
import { YoutubeLink } from "@music/youtube-link";

export class PlayCommand extends SlashCommand {
  public name = "play";
  public description = "Play the song from youtube link";
  public options: ISlashCommandOption[] = [
    {
      name: "url",
      description: "Song's youtube url.",
      required: true,
    },
  ];

  private readonly errorMap = {
    InvalidYoutubeLinkError: "Invalid youtube link.",
    ConnectionToVoiceChatNotFoundError: "Connection to voice chat not found.",
  };

  constructor(
    private readonly musicPlayerService: MusicPlayerService,
    private readonly messagingService: IMessagingService
  ) {
    super();
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      const link = new YoutubeLink(
        interaction.options.get("url").value as string
      );

      const queuedSong = await this.musicPlayerService.play(link);
      await this.messagingService.sendMessage(
        `Queued song: ${underline(bold(queuedSong.title))} by ${
          interaction.user.username
        }`
      );
    } catch (error) {
      const errorResponse = this.errorMap[error.constructor.name];

      if (!errorResponse) {
        console.error(error);
      }

      await this.messagingService.sendMessage(
        this.errorMap[error.constructor.name] || UNKNOWN_ERROR_CHAT_MESSAGE
      );
    }
  }
}
