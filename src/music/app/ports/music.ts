import {
  AudioPlayerState,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import { Song } from "@music/domain/song";
import { YoutubeLink } from "@music/infrastructure/providers/youtube-dl/youtube-link";
import { videoInfo } from "ytdl-core";
import { Readable } from "stream";

export interface IAudioAPI {
  addListener<U>(event: U, listener): IAudioAPI;
  on<U>(event: U, listener): IAudioAPI;
  pause(interpolateSilence?: boolean): boolean;
  play<T>(resource: AudioResource<T>): void;
  stop(force?: boolean): boolean;
  unpause(): boolean;

  get playable(): VoiceConnection[];
  get state(): AudioPlayerState;
}

export interface IAudioPlayerService {
  ensureVoiceChatConnection: () => void;
  handleStatusChange: (status: any, listener: any) => void;
  play: (resource: AudioResource<unknown>) => void;
  pause: () => void;
  resume: () => void;
  status: () => AudioPlayerStatus;
}

export interface IMusicPlayerService {
  play: (link: YoutubeLink) => Promise<Song>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  skip: () => Promise<void>;

  /**
   * Called when bot has been kicked/left from the voice channel
   * and user want to bring him back.
   *
   * If there was a song currently played - resume playing it
   * If there wasn't a song played - checkQueue
   */
  startAgain: () => Promise<void>;
}

export interface IYoutubeService {
  getInfo: (link: YoutubeLink) => Promise<videoInfo | null>;
  download: (song: Song) => Promise<Readable>;
}
