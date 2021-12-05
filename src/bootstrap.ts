import { Client, Intents } from "discord.js";
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import { config } from "./common/config";
import { ConfigKeys } from "./typedefs/config.types";
import { pipe, pipeP, tryCatch } from "ramda";
import { slashCommands } from "./slash-commands/definitions";
import { logger } from "./common/logger";

const getDiscordRESTClient = () =>
  new REST({ version: "9" }).setToken(config(ConfigKeys.DISCORD_BOT_TOKEN));

export const sendCommandsRequest = (restClient: typeof REST) =>
  restClient.put(
    Routes.applicationGuildCommands(
      config(ConfigKeys.DISCORD_CLIENT_ID),
      config(ConfigKeys.DISCORD_GUILD_ID)
    ),
    {
      body: slashCommands,
    }
  );

export const setUpSlashCommands = (restClient: typeof REST) =>
  tryCatch(
    (_) => logger.info("Successfully reloaded application (/) commands."),
    (error) => console.error(error)
  )(() => sendCommandsRequest(restClient));

const generateDiscordClient = async (_: void) =>
  new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });

const loginToDiscord = async (client: Client) =>
  pipeP(
    (client: Client) => client.login(config(ConfigKeys.DISCORD_BOT_TOKEN)),
    async () => client
  )(client);

const handleReadyState = async (client: Client) =>
  client.once("ready", () => console.log("logged in as ", client.user.tag));

export const deploySlashCommands = pipe(
  getDiscordRESTClient,
  setUpSlashCommands
);

export const bootstrap = pipeP(
  generateDiscordClient,
  handleReadyState,
  loginToDiscord
);
