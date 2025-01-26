import { TwitterChecker } from "@/src/module/twitterChecker";
import { DiscordChecker } from "@/src/module/discordChecker";
import { TelegramChecker } from "@/src/module/telegramChecker";

export class BaseCommunity {
  twitter: {
    handle: string | undefined;
    checker: TwitterChecker | null;
  };
  discord: {
    handle: string | undefined;
    checker: DiscordChecker | null;
  };
  telegram: {
    handle: string | undefined;
    checker: TelegramChecker | null;
  };

  constructor() {
    this.twitter = { handle: undefined, checker: null };
    this.discord = { handle: undefined, checker: null };
    this.telegram = { handle: undefined, checker: null };
  }
}
