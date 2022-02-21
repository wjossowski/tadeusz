export interface IAudioConnection {
  isActive(): boolean;
  ensureConnection(): void;
  disconnect(): void;
}
