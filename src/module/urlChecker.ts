import dns from "dns";
import axios from "axios";
import { getEnv } from "../utils/env";

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

  public getIpAddress() {
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

    console.log(address);
    console.log(apiKey);
    if (!apiKey) {
      throw new Error("IPINFO API key not found");
    }
    try {
      const res = await axios.get(
        `https://ipinfo.io/${address}?token=${apiKey}`
      );

      console.log(res.data);
      return res.data;
    } catch (error) {
      throw new Error("Failed to get IP info");
    }
  }

  public checkValidUrl() {
    if (this.url.startsWith("http://") || this.url.startsWith("https://")) {
      return true;
    }
    return false;
  }
}
