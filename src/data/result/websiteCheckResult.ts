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
    if (this.total === 0) {
      return -100;
    } else {
      this.score += this.total * 10;
    }

    for (const url of this.urls) {
      if (url.name !== "") {
        this.score += 10;
      }
      if (url.description !== "") {
        this.score += 10;
      }
      if (url.author !== "") {
        this.score += 10;
      }
      if (url.keywords !== "") {
        this.score += 10;
      }
      if (url.url !== "") {
        this.score += 10;
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
