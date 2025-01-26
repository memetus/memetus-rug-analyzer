import { Helius } from "helius-sdk";
import { getEnv } from "@/src/utils/env";
import axios from "axios";
import { logger } from "@/src/config/log";

interface IHeliusModule {}

export class HeliusModule implements IHeliusModule {
  client: Helius;
  apiKey: string;
  endPointUrl: string;

  constructor() {
    this.apiKey = getEnv("HELIUS_API_KEY");
    this.endPointUrl = "https://mainnet.helius-rpc.com";
    this.client = new Helius(this.apiKey);
  }

  async getMetadata(address: string) {
    try {
      const res = await axios.post(
        `${this.endPointUrl}?api-key=${this.apiKey}`,
        {
          jsonrpc: "2.0",
          id: "test",
          method: "getAsset",
          params: {
            id: address,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get metadata");
    }
  }

  async getAllHolders(address: string, cursor?: string) {
    try {
      if (!cursor) {
        const res = await axios.post(
          `${this.endPointUrl}?api-key=${this.apiKey}`,
          {
            jsonrpc: "2.0",
            id: "text",
            method: "getTokenAccounts",
            params: {
              mint: address,
            },
          }
        );

        return res.data;
      }
      const res = await axios.post(
        `${this.endPointUrl}?api-key=${this.apiKey}`,
        {
          jsonrpc: "2.0",
          id: "text",
          method: "getTokenAccounts",
          params: {
            mint: address,
            cursor: cursor,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(error);
      logger.error("Failed to get holders", error);
      throw new Error("Failed to get holders");
    }
  }

  async getAllTokens({
    address,
    cursor,
    limit,
  }: {
    address: string;
    cursor?: string;
    limit?: number;
  }) {
    try {
      if (!cursor) {
        const res = await axios.post(
          `${this.endPointUrl}?api-key=${this.apiKey}`,
          {
            jsonrpc: "2.0",
            id: "text",
            method: "getTokenAccounts",
            params: {
              limit: limit,
              displayOptions: {
                showZeroBalance: false,
              },
              owner: address,
            },
          }
        );

        return res.data;
      }
      const res = await axios.post(
        `${this.endPointUrl}?api-key=${this.apiKey}`,
        {
          jsonrpc: "2.0",
          id: "text",
          method: "getTokenAccounts",
          params: {
            limit: limit,
            displayOptions: {
              showZeroBalance: true,
            },
            owner: address,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(error);
      logger.error("Failed to get tokens", error);
      throw new Error("Failed to get tokens");
    }
  }
}
