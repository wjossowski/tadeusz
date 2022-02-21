import { AudioPlayerStatus } from "@discordjs/voice";
import { Readable } from "stream";

export interface IAudioPlayer {
  ensureVoiceChatConnection: () => void;
  handleStatusChange: (status: any, listener: any) => void;
  isPlaying: () => boolean;
  play: (resource: Readable) => void;
  pause: () => void;
  resume: () => void;
  status: () => AudioPlayerStatus;
}
