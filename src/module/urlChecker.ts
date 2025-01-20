import dns from "dns";
import axios from "axios";
import { getEnv } from "../utils/env";
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
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  public getHostname() {
    const isValidUrl = this.checkValidUrl();
    if (!isValidUrl) {
      throw new Error("Invalid URL");
    }

    try {
      const url = new URL(this.url);
      return url.hostname;
    } catch (err) {
      throw new Error("Invalid URL");
    }
  }

  public async getIpAddress() {
    const domain = this.getHostname();
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

  public async getUrlInfo() {
    const address = await this.getIpAddress();
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

  public checkValidUrl() {
    if (
      this.url.startsWith("http://") ||
      this.url.startsWith("https://") ||
      validator.isURL(this.url)
    ) {
      return true;
    }
    return false;
  }

  public async getUrlMetadata() {
    const isValidUrl = this.checkValidUrl();
    if (!isValidUrl) {
      throw new Error("Invalid URL");
    }

    const baseMetadata = new BaseMetadata();

    try {
      const response = await axios.get(this.url, {});
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
}
