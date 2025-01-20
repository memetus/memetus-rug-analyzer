import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { UrlChecker } from "@/src/module/urlChecker";

interface IWebsiteChecker {}

/**
 * WebsiteChecker
 * @implements {IWebsiteChecker}
 * @description This class is responsible for checking the reference of a project.
 * It should check the project's reference and verify it. It include website, whitepaper, github and twitter curretly.
 */
export class WebsiteChecker extends BaseChecker implements IWebsiteChecker {
  address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }

  public async check() {}

  public async getWebsiteData() {
    const data = await new DexScreenerGetter().getTokenWebsiteData(
      this.address
    );

    return data;
  }

  public async getWebsiteInfoData() {
    const datas = await this.getWebsiteData();
    const results = [];

    if (!datas || datas.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of datas) {
      const urlChecker = new UrlChecker(ref.url);
      const urlInfo = await urlChecker.getUrlInfo();
      results.push({
        ...ref,
        urlInfo,
      });
    }

    return results;
  }

  public async getWebsiteMetadata() {
    const datas = await this.getWebsiteData();
    const results = [];

    if (!datas || datas.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of datas) {
      if (ref.label === "Docs" || ref.label === "Whitepaper") {
        const urlChecker = new UrlChecker(ref.url);
        const urlMetadata = await urlChecker.getUrlMetadata();
        results.push({
          ...ref,
          urlMetadata,
        });
      }
    }

    return results;
  }
}
