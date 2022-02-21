import { MessagingService } from "./messaging.service";
import { discordConnection } from "@common/infrastructure/providers/discord";

export const messagingService = new MessagingService(discordConnection);
