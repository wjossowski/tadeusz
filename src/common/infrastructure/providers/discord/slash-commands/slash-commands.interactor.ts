import { CommandInteraction, GuildMember } from "discord.js";
import { Interactor, IInteractorConfig } from "@common/utils/interactor";
import { SlashCommandRepository } from "./slash-commands.repository";
import { DiscordConnection } from "../connection.service";
import { IMessagingService } from "@common/typedefs/discord";
import { random as randomEmoji } from "node-emoji";

export class SlashCommandsInteractor extends Interactor {
  constructor(
    props: IInteractorConfig,
    private readonly slashCommandRepository: SlashCommandRepository,
    private readonly discordConnection: DiscordConnection,
    private readonly messagingService: IMessagingService
  ) {
    super(props);
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isCommand()) {
      return;
    }

    this.setConnectionProps(interaction);

    const { commandName } = interaction;
    const command = this.slashCommandRepository.findByName(commandName);

    if (!command) {
      await this.messagingService.sendMessage("Not found!");
    }

    const { emoji } = randomEmoji();

    await command.execute(interaction);
    await interaction.reply(emoji);
  }

  private setConnectionProps(interaction: CommandInteraction) {
    this.discordConnection.guildId = interaction.guild.id;
    this.discordConnection.channelId = interaction.channel.id;
    this.discordConnection.voiceAdapterCreator =
      interaction.guild.voiceAdapterCreator;
    this.discordConnection.currentUser = interaction.member as GuildMember;
  }
}
