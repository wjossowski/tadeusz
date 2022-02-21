import { MusicPlayerService } from "./music-player.service";
import { connectionService } from "../common/infrastructure/providers/discord";
import { YoutubeService } from "./youtube.service";
import { MusicQueueService } from "./music-queue.service";
import { AudioPlayerService } from "./audio-player.service";
import { createAudioPlayer } from "@discordjs/voice";
import { IAudioAPI } from "../common/typedefs/music";
import { messagingService } from "@common/infrastructure/providers/discord/messaging";
import { slashCommandRepository } from "@common/infrastructure/providers/discord/slash-commands";
import { GetMusicQueueCommand } from "./infrastructure/providers/discord/slash-commands/get-music-queue.command";
import { JoinVoiceCommand } from "./infrastructure/providers/discord/slash-commands/join-voice.command";
import { PauseCommand } from "./infrastructure/providers/discord/slash-commands/pause.command";
import { PlayCommand } from "./infrastructure/providers/discord/slash-commands/play.command";
import { ResumeCommand } from "./infrastructure/providers/discord/slash-commands/resume.command";
import { SkipCommand } from "./infrastructure/providers/discord/slash-commands/skip.command";

export const youtubeService = new YoutubeService();

export const musicQueueService = new MusicQueueService();

export const audioPlayerService = new AudioPlayerService(
  connectionService,
  createAudioPlayer() as IAudioAPI
);

export const musicPlayerService = new MusicPlayerService(
  youtubeService,
  connectionService,
  messagingService,
  audioPlayerService,
  musicQueueService
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
