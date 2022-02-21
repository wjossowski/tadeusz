export class DomainError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotImplementedException extends DomainError {
  constructor(message: string = "Not implemented") {
    super(message);
  }
}

export class ConnectionToVoiceChatNotFoundError extends DomainError {
  constructor(message: string = "") {
    super(message);
  }
}
