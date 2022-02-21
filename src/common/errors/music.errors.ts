import { DomainError } from "./common.errors";

export class InvalidYoutubeLinkError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class PrivateYoutubeVideoError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class NoMusicError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class YoutubeDownloadError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
