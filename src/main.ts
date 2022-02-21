import config from "@common/config/config";
import mongoose from "mongoose";
import { DBConnectionError } from "./common/errors/db.errors";
import { Client, Intents } from "discord.js";
import { helloInteractor } from "./hello";
import { appExit, onKill } from "./common/utils/exit";
import { connectionService } from "@common/infrastructure/providers/discord";
import {
  slashCommandRepository,
  slashCommandsInteractor,
} from "@common/infrastructure/providers/discord/slash-commands";
import { SlashCommandPublisher } from "@common/infrastructure/providers/discord/slash-commands/slash-commands.publisher";

async function main() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Successfully conected to MongoDB");
  } catch (err) {
    throw new DBConnectionError(err);
  }

  // Create a new client instance
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });

  connectionService.client = client;

  await new SlashCommandPublisher(slashCommandRepository).deploy();

  // Create controllers
  helloInteractor({
    client,
    mode: "once",
    event: "ready",
  });

  slashCommandsInteractor({
    client,
    mode: "on",
    event: "interactionCreate",
  });

  // Login to Discord with your client's token
  await client.login(config.DISCORD_BOT_TOKEN);

  // Exit on error to enable a potential reboot
  process.on("uncaughtException", appExit);
  process.on("unhandledRejection", appExit);
  process.on("SIGINT", onKill);
}

void main();
