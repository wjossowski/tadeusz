import { PrivateYoutubeVideoError } from "@common/errors/music.errors";

export type SongDetails = {
  title: string;
  id: string;
  url: string;
  isPrivate: boolean;
  createdAt?: Date;
};

export class Song {
  public readonly title: string;
  public readonly id: string;
  public readonly url: string;
  public readonly isPrivate: boolean;
  public readonly createdAt?: Date;

  constructor(details: SongDetails) {
    this.title = details.title;
    this.id = details.id;
    this.url = details.url;
    this.isPrivate = details.isPrivate;
    this.createdAt = details.createdAt || new Date();

    if (details.isPrivate) {
      throw new PrivateYoutubeVideoError("Can't use a private youtube video.");
    }
  }
}
