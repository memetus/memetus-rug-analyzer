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
  total: number;
  urls: {
    url: string;
    isValid: boolean;
    name: string;
    description: string;
    keywords: string;
    canonical: string;
    autor: string;
    generator: string;
    ipAddress: string;
    location: string;
    company: string;
  }[];
  constructor() {
    const score = 0;
    super(score);
    this.total = 0;
    this.urls = [];
  }
}
