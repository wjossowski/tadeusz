import { SongDetails, Song } from "@music/domain/song";
import { Readable } from "stream";

export interface IStreamingSource {
  getInfo: (url: string) => Promise<SongDetails | null>;
  download: (song: Song) => Promise<Readable>;
}
