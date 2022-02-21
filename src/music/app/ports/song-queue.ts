import { Song } from "@music/domain/song";

export interface ISongQueue {
  getQueue: () => Promise<Song[]>;
  count: () => Promise<number>;
  dequeue: () => Promise<Song>;
  enqueue: (song: Song) => Promise<void>;
}
