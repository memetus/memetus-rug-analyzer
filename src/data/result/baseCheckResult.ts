interface IBaseCheckResult {
  score: number;
}

/**
 * BaseCheckResult
 * @implements {IBaseCheckResult}
 * @description This class is responsible for aggregate all checker in single module.
 * It should contain twitterChecker, discordChecker, telegramChecker.
 */

export class BaseCheckResult implements IBaseCheckResult {
  score: number;

  constructor(score: number) {
    this.score = score;
  }

  public async _getScore() {
    return this.score;
  }
}
