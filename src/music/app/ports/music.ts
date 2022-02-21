import {
  AudioPlayerState,
  AudioPlayerStatus,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import { Song, SongDetails } from "@music/domain/song";
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

export interface IYoutubeService {
  getInfo: (url: string) => Promise<SongDetails | null>;
  download: (song: Song) => Promise<Readable>;
}
