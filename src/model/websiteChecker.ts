import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { UrlChecker } from "@/src/module/urlChecker";
import { WebsiteCheckResult } from "@/src/data/result/websiteCheckResult";
import { UrlPair, WebsiteShape } from "@/src/types/website";
import { logger } from "@/src/config/log";
import { BaseMetadata } from "@/src/data/baseMetadata";

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

  public async check() {
    const urls = await this.getWebsiteData();

    if (!urls) {
      logger.error("Failed to get website data");
      throw new Error("Failed to get website data");
    }

    const urlDatas: WebsiteShape[] = await this.getSomeUrlData(urls);

    const checkResult = new WebsiteCheckResult();

    const data = {
      total: urlDatas.length,
      urls: [...urlDatas],
    };

    return await checkResult.setData({ data }).then(async () => {
      return await checkResult.getScore();
    });
  }

  public async getSomeUrlData(datas: UrlPair[]) {
    try {
      const results = [];

      if (!datas || datas.length === 0)
        throw new Error("Failed to get reference");

      for (const ref of datas) {
        const urlChecker = new UrlChecker();

        const urlInfo = await urlChecker.getUrlInfo(ref.url);
        if (ref.label === "Docs" || ref.label === "Whitepaper") {
          const urlMetadata = await urlChecker.getUrlMetadata(ref.url);
          results.push({
            ...ref,
            ...urlInfo,
            ...urlMetadata,
          });
        } else {
          const empty = new BaseMetadata();
          results.push({
            ...ref,
            ...urlInfo,
            ...empty,
          });
        }
      }

      return results;
    } catch (error) {
      console.log(error);
      logger.error(error);
      throw new Error("Failed to get reference");
    }
  }

  public async getWebsiteData() {
    const data = await new DexScreenerGetter().getTokenWebsiteData(
      this.address
    );
    return data;
  }

  public async getWebsiteInfoData(datas: UrlPair[]) {
    const results = [];

    if (!datas || datas.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of datas) {
      const urlChecker = new UrlChecker();
      const urlInfo = await urlChecker.getUrlInfo(ref.url);
      results.push({
        ...ref,
        urlInfo,
      });
    }

    return results;
  }

  public async getWebsiteMetadata(datas: UrlPair[]) {
    const results = [];

    if (!datas || datas.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of datas) {
      if (ref.label === "Docs" || ref.label === "Whitepaper") {
        const urlChecker = new UrlChecker();
        const urlMetadata = await urlChecker.getUrlMetadata(ref.url);
        results.push({
          ...ref,
          urlMetadata,
        });
      }
    }

    return results;
  }
}
