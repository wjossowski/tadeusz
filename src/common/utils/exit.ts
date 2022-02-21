import { discordConnection } from "../infrastructure/providers/discord";

export const appExit = (error) => {
  console.error("An error has occured. Gracefully exiting an app...\n", error);

  discordConnection.disconnectFromVoiceChat();

  process.kill(0);
};

export const onKill = () => {
  console.error("Shutting down Tadeusz...");

  discordConnection.disconnectFromVoiceChat();

  process.kill(0);
};
