import { DEX_ADDRESS } from "@/src/constant/address";

export type DexType = keyof typeof DEX_ADDRESS;

export type DexSupplyShape = {
  name: DexType;
  amount: number;
};
