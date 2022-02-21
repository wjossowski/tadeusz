export interface IChat {
  reply(content: string): Promise<void>;
  fallback(): Promise<void>;
}
