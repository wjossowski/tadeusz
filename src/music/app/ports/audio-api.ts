import {
  AudioPlayerState,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";

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
