export const SOL_CUSTER_URL = "mainnet-beta";
import dotenv from "dotenv";

dotenv.config();

export const nodeEndpoint: Record<string, string> = {
  instantNode: `https://solana-api.instantnodes.io/token-${process.env.INSTANTNODE_API_KEY}`,
  helius: `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
  quickNode: `https://maximum-muddy-dinghy.solana-mainnet.quiknode.pro/${process.env.QUICKNODE_API_KEY}`,
};
