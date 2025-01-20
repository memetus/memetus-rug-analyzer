import { TwitterChecker } from "@/src/module/twitterChecker";
import { DiscordChecker } from "@/src/module/DiscordChecker";
import { TelegramChecker } from "@/src/module/telegramChecker";

export class BaseCommunity {
  twitter!: TwitterChecker;
  discord!: DiscordChecker;
  telegram!: TelegramChecker;

  constructor() {}
}
