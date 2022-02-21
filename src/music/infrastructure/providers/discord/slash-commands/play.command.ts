import { CommandInteraction } from "discord.js";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import {
  underline,
  bold,
} from "@common/infrastructure/providers/discord/markdown";
import { IChat } from "@common/typedefs/chat";
import { UNKNOWN_ERROR_CHAT_MESSAGE } from "@common/infrastructure/providers/discord/chat/fallback";
import { MusicService } from "@music/app/music.service";

export class PlayCommand extends SlashCommand {
  private readonly errorMap = {
    InvalidYoutubeLinkError: "Invalid youtube link.",
    ConnectionToVoiceChatNotFoundError: "Connection to voice chat not found.",
  };

  constructor(
    private readonly musicPlayerService: MusicService,
    private readonly chat: IChat
  ) {
    super({
      name: "play",
      description: "Play the song from youtube link",
      options: [
        {
          name: "url",
          description: "Song's youtube url.",
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      const link = interaction.options.get("url").value as string;
      const queuedSong = await this.musicPlayerService.play(link);
      await this.chat.reply(
        `Queued song: ${underline(bold(queuedSong.title))} by ${
          interaction.user.username
        }`
      );
    } catch (error) {
      const errorResponse = this.errorMap[error.constructor.name];

      if (!errorResponse) {
        console.error(error);
      }

      await this.chat.reply(
        this.errorMap[error.constructor.name] || UNKNOWN_ERROR_CHAT_MESSAGE
      );
    }
  }
}
