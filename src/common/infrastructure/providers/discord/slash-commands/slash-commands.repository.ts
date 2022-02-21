import { SlashCommand } from "./abstract-slash-command";
import { IsClass } from "../../../../typedefs/common";

export class SlashCommandRepository {
  private readonly commands = new Map();

  public getRawCommands() {
    return this.getCommands().map(([_, value]) => value.body);
  }

  public add(commands: SlashCommand[]): void {
    for (const command of commands) {
      this.commands.set(command.constructor, command);
    }
  }

  public findByToken(token: IsClass<SlashCommand>): SlashCommand {
    return this.commands.get(token);
  }

  public findByName(name: string): SlashCommand {
    return this.getCommands().find(([_, value]) => value.body.name === name)[1];
  }

  public remove(token: IsClass<SlashCommand>): boolean {
    return this.commands.delete(token);
  }

  private getCommands(): [IsClass<SlashCommand>, SlashCommand][] {
    return Array.from(this.commands);
  }
}
