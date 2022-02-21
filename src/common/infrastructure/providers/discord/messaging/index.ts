import { MessagingService } from "./messaging.service";
import { connectionService } from "@common/infrastructure/providers/discord";

export const messagingService = new MessagingService(connectionService);
