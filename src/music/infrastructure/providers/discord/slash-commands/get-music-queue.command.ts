import { CommandInteraction } from "discord.js";
import { IChat } from "@common/typedefs/chat";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { MusicService } from "@music/app/music.service";

export class GetMusicQueueCommand extends SlashCommand {
  constructor(
    private readonly musicPlayerService: MusicService,
    private readonly chat: IChat
  ) {
    super({
      name: "music-queue",
      description: "Show queued songs.",
      options: [],
    });
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    const queue = await this.musicPlayerService.getQueue();

    if (queue.length === 0) {
      return this.chat.reply("Queue is empty.");
    }

    // noinspection JSUnusedAssignment
    const queueView = queue.reduce(
      (result, song, idx) => (result += `${idx + 1}. ${song.title}\n`),
      ""
    );

    return this.chat.reply(queueView);
  }
}
