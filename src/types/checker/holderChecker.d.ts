import { PublicKey } from "@solana/web3.js";

export type HolderCheckData = {
  address: PublicKey;
  amount: number;
  percentage: number;
};
