import dns from "dns";
import axios from "axios";
import { getEnv } from "@/src/utils/env";
import validator from "validator";
import * as cheerio from "cheerio";
import { BaseMetadata } from "@/src/data/baseMetadata";

interface IUrlChecker {}

/**
 * UrlChecker
 * @implements {IUrlChecker}
 * @description This class is responsible for checking the URL of a project.
 */
export class UrlChecker implements IUrlChecker {
  constructor() {}

  public getHostname(url: string) {
    const isValidUrl = this.checkValidUrl(url);
    if (!isValidUrl) {
      throw new Error("Invalid URL");
    }

    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (err) {
      throw new Error("Invalid URL");
    }
  }

  public async getIpAddress(url: string) {
    const domain = this.getHostname(url);
    return new Promise((resolve, reject) => {
      dns.lookup(domain, (err, address) => {
        if (err) {
          console.error(
            `Failed to resolve IP for domain: ${domain}`,
            err.message
          );
          resolve(null);
        } else {
          resolve(address);
        }
      });
    });
  }

  public async getUrlInfo(url: string) {
    const address = await this.getIpAddress(url);
    const apiKey = getEnv("IPINFO_API_KEY");

    if (!apiKey) {
      throw new Error("IPINFO API key not found");
    }
    try {
      const res = await axios.get(
        `https://ipinfo.io/${address}?token=${apiKey}`
      );

      return res.data;
    } catch (error) {
      throw new Error("Failed to get IP info");
    }
  }

  public checkValidUrl(url: string) {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      validator.isURL(url)
    ) {
      return true;
    }
    return false;
  }

  public async getUrlMetadata(url: string) {
    const isValidUrl = this.checkValidUrl(url);
    if (!isValidUrl) {
      throw new Error("Invalid URL");
    }

    const baseMetadata = new BaseMetadata();

    try {
      const response = await axios.get(url, {});
      const $ = cheerio.load(response.data);
      $("meta").each((i, meta) => {
        baseMetadata.name = $('meta[name="application-name"]').attr("content");
        baseMetadata.description = $('meta[name="description"]').attr(
          "content"
        );
        baseMetadata.keywords = $('meta[name="keywords"]').attr("content");
        baseMetadata.canonical = $('link[rel="canonical"]').attr("href");
        baseMetadata.author = $('meta[name="author"]').attr("content");
        baseMetadata.generator = $('meta[name="generator"]').attr("content");
      });

      return baseMetadata;
    } catch (err) {
      throw new Error("Invalid URL");
    }
  }

  public getUrlType(url: string) {
    if (!this.checkValidUrl(url)) {
      return null;
    }
    try {
      const parsedUrl = new URL(url);

      const hostname = parsedUrl.hostname.toLowerCase();
      if (hostname.includes("github.com")) {
        return "Github";
      } else if (
        hostname.includes("twitter.com") ||
        hostname.includes("x.com")
      ) {
        return "Twitter";
      } else if (hostname.includes("t.me")) {
        return "Telegram";
      } else if (
        hostname.includes("discord.com") ||
        hostname.includes("discord.gg")
      ) {
        return "Discord";
      } else {
        return "Website";
      }
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
}
