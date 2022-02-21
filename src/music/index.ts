import { MusicPlayerService } from "./music-player.service";
import { discordConnection } from "../common/infrastructure/providers/discord";
import { MongoSongQueue } from "./infrastructure/repositories/mongo/song.repository";
import { AudioPlayerService } from "./infrastructure/providers/discord/audio-player/audio-player.service";
import { createAudioPlayer } from "@discordjs/voice";
import { IAudioAPI } from "./app/ports/music";
import { messagingService } from "@common/infrastructure/providers/discord/messaging";
import { slashCommandRepository } from "@common/infrastructure/providers/discord/slash-commands";
import { GetMusicQueueCommand } from "./infrastructure/providers/discord/slash-commands/get-music-queue.command";
import { JoinVoiceCommand } from "./infrastructure/providers/discord/slash-commands/join-voice.command";
import { PauseCommand } from "./infrastructure/providers/discord/slash-commands/pause.command";
import { PlayCommand } from "./infrastructure/providers/discord/slash-commands/play.command";
import { ResumeCommand } from "./infrastructure/providers/discord/slash-commands/resume.command";
import { SkipCommand } from "./infrastructure/providers/discord/slash-commands/skip.command";
import { YoutubeService } from "./infrastructure/providers/youtube-dl/youtube.service";

export const youtubeService = new YoutubeService();

export const mongoSongRepository = new MongoSongQueue();

export const audioPlayerService = new AudioPlayerService(
  discordConnection,
  createAudioPlayer() as IAudioAPI
);

export const musicPlayerService = new MusicPlayerService(
  youtubeService,
  discordConnection,
  messagingService,
  audioPlayerService,
  mongoSongRepository
);

// Commands
slashCommandRepository.add([
  new PlayCommand(musicPlayerService, messagingService),
  new PauseCommand(musicPlayerService, messagingService),
  new ResumeCommand(musicPlayerService, messagingService),
  new SkipCommand(musicPlayerService, messagingService),
  new GetMusicQueueCommand(musicPlayerService, messagingService),
  new JoinVoiceCommand(audioPlayerService, musicPlayerService),
]);
