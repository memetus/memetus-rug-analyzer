interface ITwitterChecker {}

/**
 * TwitterChecker
 * @implements {ITwitterChecker}
 * @description This class is responsible for checking the twitter of a project.
 * It should check if the project has a twitter account.
 */

export class TwitterChecker implements ITwitterChecker {
  account: string;

  constructor(account: string) {
    this.account = account;
  }

  public async check() {}
}
