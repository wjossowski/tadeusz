import config from "@common/config/config";
import { bootstrapDiscord } from "./bootstrap/discord";
import { bootstrapMongo } from "./bootstrap/mongodb";
import { appExit, onKill } from "./bootstrap/lifecycle-hooks";

import "./music";

async function main() {
  await bootstrapMongo();
  await bootstrapDiscord().then((client) =>
    client.login(config.DISCORD_BOT_TOKEN)
  );

  // Exit on error to enable a potential reboot
  process.on("uncaughtException", appExit);
  process.on("unhandledRejection", appExit);
  process.on("SIGINT", onKill);
}

void main();
