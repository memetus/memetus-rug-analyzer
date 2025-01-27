import { DexSupplyShape } from "@/src/types/dex";

export type TopHolderSupplyShape = {
  address: string;
  amount: number;
  percentage: number;
};

export type HolderData = {
  dexPercentage: number;
  top10: {
    percentage: number;
    holders: TopHolderSupplyShape[];
  };
  creatorBalance: number;
  creatorPercentage: number;
  dexSupplys: DexSupplyShape[];
  totalHolderCount: number;
  topHolderValidation: { address: string; isValid: boolean }[];
};
