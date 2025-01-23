export const SOL_CUSTER_URL = "mainnet-beta";
import dotenv from "dotenv";

dotenv.config();

export const nodeEndpoint: Record<string, string> = {
  helius: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
};
