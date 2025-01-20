import { Helius } from "helius-sdk";
import { getEnv } from "@/src/utils/env";
import axios from "axios";

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
}
