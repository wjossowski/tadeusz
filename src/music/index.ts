import { MusicPlayerService } from "./app/music-player.service";
import { discordConnection } from "../common/infrastructure/providers/discord";
import { MongoSongQueue } from "./infrastructure/repositories/mongo/mongo-song-queue";
import { DiscordAudioPlayer } from "./infrastructure/providers/discord/audio-player/discord-audio-player";
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

export const mongoSongQueue = new MongoSongQueue();

export const discordAudioPlayer = new DiscordAudioPlayer(
  discordConnection,
  createAudioPlayer() as IAudioAPI
);

export const musicPlayerService = new MusicPlayerService(
  youtubeService,
  discordConnection,
  messagingService,
  discordAudioPlayer,
  mongoSongQueue
);

// Commands
slashCommandRepository.add([
  new PlayCommand(musicPlayerService, messagingService),
  new PauseCommand(musicPlayerService, messagingService),
  new ResumeCommand(musicPlayerService, messagingService),
  new SkipCommand(musicPlayerService, messagingService),
  new GetMusicQueueCommand(musicPlayerService, messagingService),
  new JoinVoiceCommand(discordAudioPlayer, musicPlayerService),
]);
