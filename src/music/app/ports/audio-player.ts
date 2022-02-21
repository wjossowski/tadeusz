import { AudioPlayerStatus } from "@discordjs/voice";
import { Readable } from "stream";

export interface IAudioPlayer {
  handleStatusChange: (status: any, listener: any) => void;
  isPlaying: () => boolean;
  play: (resource: Readable) => void;
  pause: () => void;
  stop: () => void;
  resume: () => void;
  status: () => AudioPlayerStatus;
}
