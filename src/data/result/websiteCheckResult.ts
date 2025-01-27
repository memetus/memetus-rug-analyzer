import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { WebsiteData, WebsiteShape } from "@/src/types/website";

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
  total: number;
  urls: WebsiteShape[];
  constructor() {
    const score = 0;
    super(score);
    this.total = 0;
    this.urls = [];
  }

  public async setData({ data }: { data: WebsiteData }) {
    this.total = data.total;
    this.urls = data.urls;
  }

  public async getScore() {
    if (this.total === 0) return -100;

    for (const website of this.urls) {
      if (website.ip) {
        this.score += 10;
        if (website.name && website.name !== "") {
          this.score += 5;
        }
        if (website.description && website.description === "") {
          this.score += 5;
        }
        if (website.author && website.author !== "") {
          this.score += 5;
        }
        if (website.keywords && website.keywords !== "") {
          this.score += 5;
        }
      }
    }
    if (this.score > 100) {
      return 100;
    } else if (this.score < -100) {
      return -100;
    }

    return this.score;
  }
}
