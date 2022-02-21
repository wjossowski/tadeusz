export interface IAudioConnection {
  isActive(): boolean;
  ensureVoiceChatConnection(): void;
}
