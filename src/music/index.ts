import { MusicService } from "./app/music.service";
import {
  discordChat,
  discordConnection,
} from "../common/infrastructure/providers/discord";
import { MongoSongQueue } from "./infrastructure/repositories/mongo/mongo-song-queue";
import { DiscordAudioPlayer } from "./infrastructure/providers/discord/audio-player/discord-audio-player";
import { createAudioPlayer } from "@discordjs/voice";
import { GetMusicQueueCommand } from "./infrastructure/providers/discord/slash-commands/get-music-queue.command";
import { JoinVoiceCommand } from "./infrastructure/providers/discord/slash-commands/join-voice.command";
import { PauseCommand } from "./infrastructure/providers/discord/slash-commands/pause.command";
import { PlayCommand } from "./infrastructure/providers/discord/slash-commands/play.command";
import { ResumeCommand } from "./infrastructure/providers/discord/slash-commands/resume.command";
import { SkipCommand } from "./infrastructure/providers/discord/slash-commands/skip.command";
import { YoutubeStreamingService } from "./infrastructure/providers/youtube-dl/youtube.service";
import { SlashCommandRegistry } from "@common/infrastructure/providers/discord/slash-commands/slash-commands.registry";
import { ISongQueue } from "./app/ports/song-queue";
import { IAudioPlayer } from "./app/ports/audio-player";
import { IStreamingSource } from "./app/ports/streaming-source";
import { IAudioAPI } from "./app/ports/audio-api";

export class MusicModule {
  constructor(
    private readonly discordAudioPlayer: IAudioPlayer,
    private readonly streamingSource: IStreamingSource,
    private readonly queue: ISongQueue
  ) {}

  public readonly musicPlayerService = new MusicService(
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
      new JoinVoiceCommand(this.musicPlayerService),
    ]);

    return this;
  }
}

export const Music = new MusicModule(
  new DiscordAudioPlayer(discordConnection, createAudioPlayer() as IAudioAPI),
  new YoutubeStreamingService(),
  new MongoSongQueue()
);
