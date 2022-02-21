import { CommandInteraction } from "discord.js";
import { IMessagingService } from "@common/typedefs/discord";
import { SlashCommand } from "@common/infrastructure/providers/discord/slash-commands/abstract-slash-command";
import { MusicPlayerService } from "@music/music-player.service";

export class GetMusicQueueCommand extends SlashCommand {
  public name = "music-queue";
  public description = "Show queued songs.";
  public options = [];

  constructor(
    private readonly musicPlayerService: MusicPlayerService,
    private readonly messagingService: IMessagingService
  ) {
    super();
  }

  async execute(_interaction: CommandInteraction): Promise<void> {
    const queue = await this.musicPlayerService.getQueue();

    if (queue.length === 0) {
      return this.messagingService.sendMessage("Queue is empty.");
    }

    // noinspection JSUnusedAssignment
    const queueView = queue.reduce(
      (result, song, idx) => (result += `${idx + 1}. ${song.title}\n`),
      ""
    );

    return this.messagingService.sendMessage(queueView);
  }
}
