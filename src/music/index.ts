import { MusicService } from "./app/music.service";
import {
  discordChat,
  discordConnection,
  slashCommandRegistry,
} from "@common/infrastructure/providers/discord";
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
import { ISongQueue } from "./app/ports/song-queue";
import { IAudioPlayer } from "./app/ports/audio-player";
import { IStreamingSource } from "./app/ports/streaming-source";
import { IAudioAPI } from "./app/ports/audio-api";
import { DiscordAudioConnection } from "./infrastructure/providers/discord/audio-player/discord-audio-connection";

export class MusicModule {
  constructor(
    private readonly discordAudioPlayer: IAudioPlayer,
    private readonly streamingSource: IStreamingSource,
    private readonly queue: ISongQueue
  ) {}

  public readonly service = new MusicService(
    this.streamingSource,
    this.discordAudioPlayer,
    this.queue,
    discordChat
  );

  public setup() {
    slashCommandRegistry.add([
      new PlayCommand(this.service, discordChat),
      new PauseCommand(this.service, discordChat),
      new ResumeCommand(this.service, discordChat),
      new SkipCommand(this.service, discordChat),
      new GetMusicQueueCommand(this.service, discordChat),
      new JoinVoiceCommand(this.service),
    ]);

    return this;
  }
}

const audioApi = createAudioPlayer() as IAudioAPI;

export const music = new MusicModule(
  new DiscordAudioPlayer(
    new DiscordAudioConnection(discordConnection, audioApi),
    audioApi
  ),
  new YoutubeStreamingService(),
  new MongoSongQueue()
).setup();
