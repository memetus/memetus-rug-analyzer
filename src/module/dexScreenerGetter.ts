import axios from "axios";

interface IDexScreenerGetter {}

/**
 * DexScreenerGetter
 * @implements {IDexScreenerGetter}
 * @description This class is responsible for getting the data from DexScreener.
 */

export class DexScreenerGetter implements IDexScreenerGetter {
  constructor() {}

  public async getLatestCreatedToken() {
    try {
      const res = await axios.get(
        "https://api.dexscreener.com/token-profiles/latest/v1"
      );

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get latest created token");
    }
  }

  public async getLatestBoostedToken() {
    try {
      const res = await axios.get(
        "https://api.dexscreener.com/token-boosts/latest/v1"
      );

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get latest boosting token");
    }
  }

  public async getMostBoostedToken() {
    try {
      const res = await axios.get(
        "https://api.dexscreener.com/token-boosts/top/v1"
      );

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get most boosting token");
    }
  }

  public async getTokenSearchPair(pair: string) {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/search?q=${pair}`
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get token search pair");
    }
  }

  public async getTokenSearchAddress(address: string) {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/token-pairs/v1/solana/${address}`
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get token search address");
    }
  }
}
