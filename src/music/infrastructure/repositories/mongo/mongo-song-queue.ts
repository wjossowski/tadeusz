import { Song } from "../../../domain/song";
import { ISongSchema, SongEntity } from "./model/song.entity";
import { ISongQueue } from "@music/app/ports/song-queue";

export class MongoSongQueue implements ISongQueue {
  async getQueue(): Promise<Song[]> {
    const songs = await SongEntity.find();
    return songs.map(this.deserialize);
  }

  async count(): Promise<number> {
    return SongEntity.count();
  }

  async dequeue(): Promise<Song> {
    const songEntity = await SongEntity.findOne({ $sort: { _id: -1 } });
    await SongEntity.findOneAndDelete({ _id: songEntity._id }).exec();
    return this.deserialize(songEntity);
  }

  async enqueue(song: Song): Promise<void> {
    const songEntity = this.serialize(song);
    await songEntity.save();
  }

  private serialize(song: Song) {
    return new SongEntity({
      title: song.title,
      id: song.id,
      url: song.url,
      isPrivate: song.isPrivate,
      createdAt: song.createdAt,
    });
  }

  private deserialize(record: ISongSchema) {
    return new Song({
      id: record.id,
      isPrivate: record.isPrivate,
      title: record.title,
      url: record.url,
      createdAt: record.createdAt,
    });
  }
}
