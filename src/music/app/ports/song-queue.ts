import { Song } from "@music/domain/song";

export interface ISongQueue {
  getQueue: () => Promise<Song[]>;
  getQueueLength: () => Promise<number>;
  dequeue: () => Promise<Song>;
  enqueue: (song: Song) => Promise<void>;
}
