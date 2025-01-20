import { BaseCheckResult } from "./baseCheckResult";

interface IWebsiteCheckResult {}

/**
 * WebsiteCheckResult
 * @implements {IWebsiteCheckResult}
 * @description This class is responsible for checking the website of a project.
 * It should check if the project has a website.
 */

export class WebsiteCheckResult
  extends BaseCheckResult
  implements IWebsiteCheckResult
{
  constructor(score: number) {
    super(score);
  }
}
