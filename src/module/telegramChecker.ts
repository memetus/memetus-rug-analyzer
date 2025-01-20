interface ITelegramChecker {}

/**
 * TelegramChecker
 * @implements {ITelegramChecker}
 * @description This class is responsible for checking the telegram of a project.
 * It should check if the project has a telegram account.
 */

export class TelegramChecker implements ITelegramChecker {
  channel: string;

  constructor(channel: string) {
    this.channel = channel;
  }
}
