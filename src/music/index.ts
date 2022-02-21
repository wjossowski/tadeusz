import { MusicPlayerService } from "./app/music-player.service";
import { discordConnection } from "../common/infrastructure/providers/discord";
import { MongoSongQueue } from "./infrastructure/repositories/mongo/mongo-song-queue";
import { DiscordAudioPlayer } from "./infrastructure/providers/discord/audio-player/discord-audio-player";
import { createAudioPlayer } from "@discordjs/voice";
import { IAudioAPI, IAudioPlayer, IStreamingSource } from "./app/ports/music";
import { discordChat } from "@common/infrastructure/providers/discord/messaging";
import { GetMusicQueueCommand } from "./infrastructure/providers/discord/slash-commands/get-music-queue.command";
import { JoinVoiceCommand } from "./infrastructure/providers/discord/slash-commands/join-voice.command";
import { PauseCommand } from "./infrastructure/providers/discord/slash-commands/pause.command";
import { PlayCommand } from "./infrastructure/providers/discord/slash-commands/play.command";
import { ResumeCommand } from "./infrastructure/providers/discord/slash-commands/resume.command";
import { SkipCommand } from "./infrastructure/providers/discord/slash-commands/skip.command";
import { YoutubeStreamingService } from "./infrastructure/providers/youtube-dl/youtube.service";
import { SlashCommandRegistry } from "@common/infrastructure/providers/discord/slash-commands/slash-commands.repository";
import { ISongQueue } from "./app/ports/song-queue";

export class MusicModule {
  constructor(
    private readonly discordAudioPlayer: IAudioPlayer,
    private readonly streamingSource: IStreamingSource,
    private readonly queue: ISongQueue
  ) {}

  public readonly musicPlayerService = new MusicPlayerService(
    this.streamingSource,
    discordConnection,
    discordChat,
    this.discordAudioPlayer,
    this.queue
  );

  public setup(slashCommandRepository: SlashCommandRegistry) {
    slashCommandRepository.add([
      new PlayCommand(this.musicPlayerService, discordChat),
      new PauseCommand(this.musicPlayerService, discordChat),
      new ResumeCommand(this.musicPlayerService, discordChat),
      new SkipCommand(this.musicPlayerService, discordChat),
      new GetMusicQueueCommand(this.musicPlayerService, discordChat),
      new JoinVoiceCommand(this.discordAudioPlayer, this.musicPlayerService),
    ]);

    return this;
  }
}

export const Music = new MusicModule(
  new DiscordAudioPlayer(discordConnection, createAudioPlayer() as IAudioAPI),
  new YoutubeStreamingService(),
  new MongoSongQueue()
);
